import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';

import { jwtConstants } from './constants';

import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt/dist';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const find = await this.usersService.findOneByUsername(username);

    let match = false;

    if (find && find.password) {
      match = await compare(password, find.password);
    }

    if (match) {
      return find;
    } else {
      return null;
    }
  }

  async login(user: any) {
    const payload = {
      uuid: user.uuid,
      username: user.username,
      role: user.role,
    };

    return {
      username: user.username,
      role: user.role,
      access_token: this.jwtService.sign(payload, jwtConstants),
    };
  }
}
