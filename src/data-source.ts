'reflect-metadata';
import { DataSource } from 'typeorm';

import * as dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

import { CreateTableUser20240226878346 } from './migrations/20240226878346-CreateTableUser';

import { SeedUserAdmin20240226878347 } from './migrations/20240226878347-SeedUserAdmin';
import { User } from './users/user.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [User],
  subscribers: [],
  migrations: [CreateTableUser20240226878346, SeedUserAdmin20240226878347],
  namingStrategy: new SnakeNamingStrategy(),
});

export default AppDataSource;
