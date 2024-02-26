import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let rawResponse: string | object;
    let message: Array<string>;
    let databaseErrorResponse: string;

    // modify error handler later
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();

      const response = exception.getResponse();
      if (typeof response === 'string') {
        message = [response];
      } else if (typeof response === 'object' && 'message' in response) {
        if (typeof response.message === 'string') {
          message = [response.message];
        } else if (
          Array.isArray(response.message) &&
          typeof response.message[0] === 'string'
        ) {
          message = response.message;
        }
      }
    } else if (exception instanceof QueryFailedError) {
      databaseErrorResponse = exception.message;
    }

    type ExceptionWithDetail = object & { detail: string };

    function isCustomException(obj: any): obj is ExceptionWithDetail {
      return obj && typeof obj.detail === 'string';
    }

    let responseBody: {
      statusCode: number;
      timestamp?: string;
      path?: string;
      message: string | object;
      exception?: ExceptionWithDetail | unknown;
      details?: string;
    } = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: message || rawResponse || databaseErrorResponse,
      // exception_type: instanceof exception,
      exception,
    };

    const method: string = host?.getArgs()?.[0]?.method || '';
    const isMethodRecognizable = ['GET', 'POST', 'PUT'].includes(method);
    if (isMethodRecognizable) {
      const skippedResponseStatus = [401, 403, 404];
      if (skippedResponseStatus.includes(responseBody.statusCode)) {
        responseBody = {
          statusCode: responseBody.statusCode,
          message: responseBody.message,
        };
      }
      if (
        typeof responseBody.message == 'string' &&
        responseBody.message?.includes('unique constraint') &&
        isCustomException(responseBody.exception)
      ) {
        responseBody = {
          statusCode: responseBody.statusCode,
          message: responseBody.message.split('"')[0],
          timestamp: responseBody.timestamp,
          details: responseBody.exception.detail,
        };
      }
      console.log(responseBody);
    }
    delete responseBody.exception;
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
