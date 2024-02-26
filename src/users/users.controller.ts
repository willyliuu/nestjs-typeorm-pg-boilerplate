import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  Param,
  Put,
  HttpException,
  HttpStatus,
  Res,
  Query,
} from '@nestjs/common';

import { extendedReq, extendedRes } from 'src/interfaces/request.interface';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

import { ConstantControllerStatus } from 'src/filters/constant-controller-status';

import { AuthService } from 'src/auth/auth.service';
import { UsersService } from './users.service';

import { User } from './user.entity';

import {
  RegisterUserDto,
  FindUserDto,
  UpdateUserDto,
  DeleteUserDto,
  FindUserQueryDto,
  ChangeUserPasswordDto,
} from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('register')
  @Roles(Role.Superuser)
  async register(
    @Request() req: extendedReq,
    @Body() body: RegisterUserDto,
  ): Promise<User> {
    return await this.usersService.create({
      username: body.username,
      password: body.password,
      role: body.role,
      adminUuid: req.user.uuid,
    });
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: extendedReq,
  ): Promise<{ username: string; role: string; access_token: string }> {
    return this.authService.login(req.user);
  }

  @Get()
  @Roles(Role.Superuser)
  async findAll(@Query() query: FindUserQueryDto): Promise<User[]> {
    return await this.usersService.findAll(query);
  }

  @Get(':uuid')
  async findOne(
    @Param() param: FindUserDto,
  ): Promise<{ username: string; role: string }> {
    const data = await this.usersService.find(param.uuid);
    return { username: data.username, role: data.role };
  }

  @Put('/change-password')
  @Roles(Role.Superuser)
  async updateChangePassword(
    @Res() res: extendedRes,
    @Body() body: ChangeUserPasswordDto,
    @Request() req: extendedReq,
  ): Promise<void> {
    const serviceInfo = await this.usersService.changePassword({
      uuid: req.user.uuid,
      username: body.username,
      oldPassword: body.oldPassword,
      newPassword: body.newPassword,
      updatedAt: new Date(body.updatedAt),
    });

    if (serviceInfo.status === 'NOT_FOUND') {
      throw new HttpException(
        ConstantControllerStatus.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    } else if (serviceInfo.status === 'INVALID_UPDATE_DATE_CONDITION') {
      throw new HttpException(
        ConstantControllerStatus.INVALID_UPDATE_DATE_CONDITION,
        HttpStatus.NOT_FOUND,
      );
    } else if (serviceInfo.status === 'INVALID_OLD_PASSWORD_CONDITION') {
      throw new HttpException(
        ConstantControllerStatus.INVALID_OLD_PASSWORD_CONDITION,
        HttpStatus.UNAUTHORIZED,
      );
    }

    res.status(HttpStatus.OK).json({
      message: ConstantControllerStatus.SUCCESS,
    });
  }

  @Put(':uuid')
  @Roles(Role.Superuser)
  async update(
    @Res() res: extendedRes,
    @Param() param: FindUserDto,
    @Body() body: UpdateUserDto,
  ): Promise<void> {
    const serviceInfo = await this.usersService.update({
      uuid: param.uuid,
      username: body.username,
      password: body.password,
      role: body.role,
      updatedAt: new Date(body.updatedAt),
    });

    if (serviceInfo.status === ConstantControllerStatus.NOT_FOUND) {
      throw new HttpException(
        ConstantControllerStatus.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    } else if (
      serviceInfo.status ===
      ConstantControllerStatus.INVALID_DELETE_DATE_CONDITION
    ) {
      throw new HttpException(
        ConstantControllerStatus.INVALID_UPDATE_DATE_CONDITION,
        HttpStatus.NOT_FOUND,
      );
    }

    res.status(HttpStatus.OK).json({
      message: ConstantControllerStatus.SUCCESS,
    });
  }

  @Put('/delete/:uuid')
  @Roles(Role.Superuser)
  async delete(
    @Res() res: extendedRes,
    @Param() param: FindUserDto,
    @Body() body: DeleteUserDto,
  ): Promise<void> {
    const serviceInfo = await this.usersService.delete({
      uuid: param.uuid,
      username: body.username,
      password: body.password,
      role: body.role,
      updatedAt: new Date(body.updatedAt),
      deletedAt: new Date(body.deletedAt),
    });

    if (serviceInfo.status === ConstantControllerStatus.NOT_FOUND) {
      throw new HttpException(
        ConstantControllerStatus.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    } else if (
      serviceInfo.status ===
      ConstantControllerStatus.INVALID_DELETE_DATE_CONDITION
    ) {
      throw new HttpException(
        ConstantControllerStatus.INVALID_DELETE_DATE_CONDITION,
        HttpStatus.NOT_FOUND,
      );
    }

    res.status(HttpStatus.OK).json({
      message: ConstantControllerStatus.SUCCESS,
    });
  }
}
