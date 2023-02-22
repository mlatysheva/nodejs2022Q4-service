import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomLogger } from './customLogger';
import { LoggerService } from './logger.service';
import { Log } from './entities/log.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Log])],
  providers: [CustomLogger, LoggerService],
  exports: [CustomLogger],
})
export class LoggerModule {}
