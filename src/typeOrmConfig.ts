import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

dotenv.config();

export const options = {
  type: 'postgres',
  host: (process.env.POSTGRES_HOST as string) || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT as string, 10) as number,
  username: process.env.POSTGRES_USER as string,
  database: process.env.POSTGRES_DB as string,
  password: process.env.POSTGRES_PASSWORD as string,
  migrationsRun: true,
  synchronize: false,
  logging: true,
  logger: 'file',
};

export const dataSourceConfig = {
  ...options,
  entities: ['dist/**/**/entities/*.entity.js'],
  migrations: ['src/migrations/*.{ts,js}'],
} as DataSourceOptions;

export const typeOrmConfig = {
  ...options,
  entities: [__dirname + '/**/**/*.entity.{ts,js}'],
  migrations: [__dirname + './migrations/*.{ts,js}'],
  retryAttempts: 10,
} as TypeOrmModuleOptions;
