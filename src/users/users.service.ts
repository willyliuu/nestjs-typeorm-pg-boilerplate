import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';
import { StatusServiceInterface } from 'src/interfaces/status-service.interface';
import { ConstantControllerStatus } from 'src/filters/constant-controller-status';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(input: {
    username: string;
    password: string;
    role: string;
    adminUuid: string;
  }): Promise<User> {
    const hashPassword = await bcrypt.hash(
      input.password,
      Number(process.env.BCRYPT_SALT),
    );

    return this.usersRepository.save({
      username: input.username,
      password: hashPassword,
      role: input.role,
      adminUuid: input.adminUuid,
    });
  }

  findAll(input: {
    role?: string;
    adminUuid?: string;
    clientName?: string;
  }): Promise<User[]> {
    const findQuery = {
      deletedAt: IsNull(),
    };

    if (input.role) findQuery['role'] = input.role;
    if (input.adminUuid) findQuery['adminUuid'] = input.adminUuid;
    if (input.clientName) findQuery['clientName'] = input.clientName;

    return this.usersRepository.find({
      where: findQuery,
      select: {
        uuid: true,
        username: true,
        role: true,
        adminUuid: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        admin: {
          username: true,
          role: true,
        },
      },
      relations: {
        admin: true,
      },
    });
  }

  find(uuid: string): Promise<User> {
    return this.usersRepository.findOneBy({ uuid });
  }

  findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({
      username,
    });
  }

  async update(input: {
    uuid: string;
    username: string;
    password: string;
    role: string;
    updatedAt: Date;
  }): Promise<StatusServiceInterface> {
    const find = await this.usersRepository.findOne({
      where: { uuid: input.uuid },
    });

    if (!find) {
      return {
        status: ConstantControllerStatus.NOT_FOUND,
      };
    } else if (find.updatedAt > input.updatedAt) {
      return {
        status: ConstantControllerStatus.INVALID_UPDATE_DATE_CONDITION,
      };
    }

    const hashPassword = await bcrypt.hash(
      input.password,
      Number(process.env.BCRYPT_SALT),
    );

    await this.usersRepository.update(
      { uuid: input.uuid },
      {
        username: input.username,
        password: hashPassword,
        role: input.role,
        updatedAt: input.updatedAt,
        deletedAt: null,
      },
    );

    return {
      status: ConstantControllerStatus.SUCCESS,
    };
  }

  async changePassword(input: {
    uuid: string;
    username: string;
    oldPassword: string;
    newPassword: string;
    updatedAt: Date;
  }): Promise<StatusServiceInterface> {
    const find = await this.usersRepository.findOne({
      where: {
        uuid: input.uuid,
        username: input.username,
      },
    });

    if (!find) {
      return {
        status: ConstantControllerStatus.NOT_FOUND,
      };
    } else if (find.updatedAt > input.updatedAt) {
      return {
        status: ConstantControllerStatus.INVALID_UPDATE_DATE_CONDITION,
      };
    }

    const isOldPasswordValid = await bcrypt.compare(
      input.oldPassword,
      find.password,
    );

    if (!isOldPasswordValid) {
      return {
        status: ConstantControllerStatus.INVALID_OLD_PASSWORD_CONDITION,
      };
    }

    // create new password
    const newPasswordHash = await bcrypt.hash(
      input.newPassword,
      Number(process.env.BCRYPT_SALT),
    );

    await this.usersRepository.update(
      { uuid: input.uuid },
      {
        username: input.username,
        password: newPasswordHash,
        updatedAt: input.updatedAt,
      },
    );

    return { status: ConstantControllerStatus.SUCCESS };
  }

  async delete(input: {
    uuid: string;
    username: string;
    password: string;
    role: string;
    updatedAt: Date;
    deletedAt: Date;
  }): Promise<StatusServiceInterface> {
    const find = await this.usersRepository.findOne({
      where: { uuid: input.uuid },
    });

    if (!find) {
      return {
        status: ConstantControllerStatus.NOT_FOUND,
      };
    } else if (find.updatedAt > input.updatedAt) {
      return {
        status: ConstantControllerStatus.INVALID_DELETE_DATE_CONDITION,
      };
    }

    const hashPassword = await bcrypt.hash(
      input.password,
      Number(process.env.BCRYPT_SALT),
    );

    await this.usersRepository.update(
      { uuid: input.uuid },
      {
        username: input.username,
        password: hashPassword,
        role: input.role,
        updatedAt: input.updatedAt,
        deletedAt: input.deletedAt,
      },
    );

    return { status: ConstantControllerStatus.SUCCESS };
  }
}
