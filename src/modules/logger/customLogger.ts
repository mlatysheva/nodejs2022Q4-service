import { Injectable, ConsoleLogger } from '@nestjs/common';
import { ConsoleLoggerOptions } from '@nestjs/common/services/console-logger.service';
import { ConfigService } from '@nestjs/config';
import { getLogLevels } from './getLogLevels';
import { CreateLogDto } from './dto/createLog.dto';
import { EOL } from 'os';
import { statSync, mkdirSync, writeFileSync, appendFileSync } from 'fs';
import { join } from 'path';
import { ErrorMessage } from '../../constants/errors';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  constructor(context: string) {
    super(context, {
      logLevels: getLogLevels(),
    });
  }
  private logLevels = getLogLevels();

  async createLog(log: CreateLogDto) {
    const newLog = `[NEST] ${new Date().toUTCString()} [Level: ${
      log.level
    }] Context: ${log.context} Message: ${log.message}${EOL}`;
    return newLog;
  }

  async log(message: string, context: string | 'NEST') {
    if (!this.logLevels.includes('log')) return;

    super.log.apply(this, [message, context || 'NEST']);

    const newLog = await this.createLog({
      message,
      context,
      level: 'log',
    });
    this.writeToFile(newLog);
  }

  async error(message: string, stack?: string, context?: string | 'NEST') {
    if (!this.logLevels.includes('error')) return;

    super.error.apply(this, [message, stack, context || 'NEST']);

    await this.createLog({
      message,
      context,
      level: 'error',
    });
  }

  async warn(message: string, context?: string | 'NEST') {
    if (!this.logLevels.includes('warn')) return;

    super.warn.apply(this, [message, context || 'NEST']);

    await this.createLog({
      message,
      context,
      level: 'warn',
    });
  }

  async debug(message: string, context?: string | '[NEST]') {
    if (!this.logLevels.includes('debug')) return;

    super.debug.apply(this, [message, context || 'NEST']);

    await this.createLog({
      message,
      context,
      level: 'debug',
    });
  }

  async verbose(message: string, context?: string | 'NEST') {
    if (!this.logLevels.includes('verbose')) return;

    super.verbose.apply(this, [message, context]);

    await this.createLog({
      message,
      context,
      level: 'verbose',
    });
  }

  private logsDirectory = join(__dirname, 'logs');

  private getLogFilePath = (): string => {
    return join(this.logsDirectory, 'logFile.txt');
  };

  private createLogsDirectory = (): void => {
    try {
      if (statSync(this.logsDirectory)) {
        return;
      }
      mkdirSync(this.logsDirectory, { recursive: true });
    } catch (error) {
      throw new Error(ErrorMessage.ERROR_CREATING_DIRECTORY);
    }
  };

  private createLogsFile = (): string => {
    try {
      const logsFile = join(this.logsDirectory, 'logsFile.txt');
      if (statSync(logsFile)) {
        return logsFile;
      }
      writeFileSync(logsFile, '', {
        encoding: 'utf8',
        flag: 'w',
      });
    } catch (error) {
      throw Error(ErrorMessage.ERROR_CREATING_FILE);
    }
  };

  private writeToFile = (message: string) => {
    try {
      const logsFile = this.getLogFilePath();
      appendFileSync(logsFile, message, 'utf8');
    } catch (error) {
      throw Error(ErrorMessage.ERROR_WRITING_TO_FILE);
    }
  };
}
