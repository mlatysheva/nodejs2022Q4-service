import { Injectable, ConsoleLogger } from '@nestjs/common';
import { ConsoleLoggerOptions } from '@nestjs/common/services/console-logger.service';
import { ConfigService } from '@nestjs/config';
import getLogLevels from './getLogLevels';
import { LogsService } from './logs.service';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private readonly logsService: LogsService;

  constructor(
    context: string,
    options: ConsoleLoggerOptions,
    configService: ConfigService,
    logsService: LogsService,
  ) {
    const environment = configService.get('NODE_ENV');

    super(context, {
      ...options,
      logLevels: getLogLevels(environment === 'production'),
    });

    this.logsService = logsService;
  }

  async log(message: string, context: string | '[NEST]') {
    super.log.apply(this, [message, context]);

    await this.logsService.createLog({
      message,
      context,
      level: 'log',
    });
  }

  async error(message: string, stack?: string, context?: string | 'NEST') {
    super.error.apply(this, [message, stack, context]);

    await this.logsService.createLog({
      message,
      context: 'NEST',
      level: 'error',
    });
  }

  async warn(message: string, context?: string | '[NEST]') {
    super.warn.apply(this, [message, context]);

    await this.logsService.createLog({
      message,
      context,
      level: 'warn',
    });
  }

  async debug(message: string, context?: string | '[NEST]') {
    super.debug.apply(this, [message, context]);

    await this.logsService.createLog({
      message,
      context,
      level: 'debug',
    });
  }

  async verbose(message: string, context?: string | '[NEST]') {
    super.debug.apply(this, [message, context]);

    await this.logsService.createLog({
      message,
      context,
      level: 'verbose',
    });
  }
}
