import { Injectable, ConsoleLogger } from '@nestjs/common';
import { ConsoleLoggerOptions } from '@nestjs/common/services/console-logger.service';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './logger.service';
import getLogLevels from './getLogLevels';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private readonly loggerService: LoggerService;

  constructor(
    context: string,
    options: ConsoleLoggerOptions,
    configService: ConfigService,
    loggerService: LoggerService,
  ) {
    const environment = configService.get('NODE_ENV');

    super(context, {
      ...options,
      logLevels: getLogLevels(environment === 'production'),
    });

    this.loggerService = loggerService;
  }

  log(message: string, context?: string) {
    super.log.apply(this, [message, context]);

    this.loggerService.createLog({
      message,
      context,
      level: 'log',
    });
  }
  error(message: string, stack?: string, context?: string) {
    super.error.apply(this, [message, stack, context]);

    this.loggerService.createLog({
      message,
      context,
      level: 'error',
    });
  }
  warn(message: string, context?: string) {
    super.warn.apply(this, [message, context]);

    this.loggerService.createLog({
      message,
      context,
      level: 'error',
    });
  }
  debug(message: string, context?: string) {
    super.debug.apply(this, [message, context]);

    this.loggerService.createLog({
      message,
      context,
      level: 'error',
    });
  }
  verbose(message: string, context?: string) {
    super.debug.apply(this, [message, context]);

    this.loggerService.createLog({
      message,
      context,
      level: 'error',
    });
  }
}
