import { Request as Req, Response } from 'express';

export interface extendedReq extends Req {
  user: {
    uuid: string;
    username: string;
    role: string;
  };
}

export interface extendedRes extends Response {}
