import { IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  role: string;
}

export class FindUserDto {
  @IsNotEmpty()
  uuid: string;
}

export class FindUserQueryDto {
  @IsOptional()
  role: string;

  @IsOptional()
  adminUuid: string;

  @IsOptional()
  clientName: string;
}

export class UpdateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  role: string;

  @IsDateString()
  updatedAt: string;
}

export class DeleteUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  role: string;

  @IsDateString()
  updatedAt: string;

  @IsDateString()
  deletedAt: string;
}

export class ChangeUserPasswordDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  newPassword: string;

  @IsDateString()
  updatedAt: string;
}
