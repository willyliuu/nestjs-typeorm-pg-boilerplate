import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OWNERSHIP_KEY, Ownership } from 'src/decorators/ownership.decorator';
import { Controller, Method } from 'src/enums/controller.enum';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const className = context.getClass().name;
    const methodName = context.getHandler().name;

    if (Boolean(Controller[className]) && Boolean(Method[methodName])) {
      const { model, lookupKey, value } =
        this.reflector.getAllAndOverride<Ownership>(OWNERSHIP_KEY, [
          context.getClass(),
          context.getHandler(),
        ]);
      const { user, params } = context.switchToHttp().getRequest();
      const result: any[] = await this.dataSource.query(`
        select * from ${model} where uuid = '${params.uuid}';
      `);
      const found: boolean = result?.[0]?.[lookupKey] == (value || user.uuid);
      return found;
    }
    return true;
  }
}
