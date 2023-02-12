import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const typeOrmConfig: TypeOrmModuleOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async () => ({
    type: 'postgres',
    host: (process.env.POSTGRES_HOST as string) || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT as string, 10) as number,
    username: process.env.POSTGRES_USER as string,
    database: process.env.POSTGRES_DB as string,
    password: process.env.POSTGRES_PASSWORD as string,
    entities: [__dirname + 'dist/**/*.entity.{ts,js}'],
    autoLoadEntities: true,
    synchronize: true,
    logging: true,
    migrationsRun: false,
    migrationsTableName: 'migration',
    migrations: [
      __dirname + '/migration/**/*.ts',
      __dirname + '/migration/**/*.js',
    ],
    cli: {
      migrationsDir: 'src/migration',
    },
  }),
} as TypeOrmModuleOptions;
