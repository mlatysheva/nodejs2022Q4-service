import { Injectable, ConsoleLogger } from '@nestjs/common';
import { getLogLevels } from './getLogLevels';
import { CreateLogDto } from './dto/createLog.dto';
import { EOL } from 'os';
import { appendFileSync } from 'fs';
import { ErrorMessage } from '../../constants/errors';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private logLevels = getLogLevels();
  private logsFolderPath: string;
  private logsFilePath: string;
  private errorLogsFilePath: string;
  private maxLogFileSize =
    Number(process.env.MAX_SIZE_LOG_FILE) * 1024 || 25 * 1024;

  constructor() {
    super();
    this.logsFolderPath = path.join(process.cwd(), 'logs');
    this.logsFilePath = this.createLogFile('log');
    this.errorLogsFilePath = this.createLogFile('error');
  }

  createLog(log: CreateLogDto) {
    const newLog = `[NEST] ${new Date().toUTCString()} [Level: ${
      log.level
    }] Context: ${log.context} Message: ${log.message}${EOL}`;
    return newLog;
  }

  log(message: string, context: string | 'NEST') {
    if (!this.logLevels.includes('log')) return;

    super.log(message, context || 'NEST');

    const newLog = this.createLog({
      message,
      context,
      level: 'log',
    });
    this.writeToLogFile('log', newLog);
  }

  error(message: string, context?: string | 'NEST', stack?: string) {
    if (!this.logLevels.includes('error')) return;

    super.error(message, stack, context || 'NEST');

    const newLog = this.createLog({
      message,
      context,
      level: 'error',
    });
    this.writeToLogFile('error', newLog);
  }

  warn(message: string, context?: string | 'NEST') {
    if (!this.logLevels.includes('warn')) return;

    super.warn(message, context || 'NEST');

    const newLog = this.createLog({
      message,
      context,
      level: 'warn',
    });
    this.writeToLogFile('warn', newLog);
  }

  debug(message: string, context?: string | 'NEST') {
    if (!this.logLevels.includes('debug')) return;

    super.debug(message, context || 'NEST');

    const newLog = this.createLog({
      message,
      context,
      level: 'debug',
    });
    this.writeToLogFile('debug', newLog);
  }

  verbose(message: string, context?: string | 'NEST') {
    if (!this.logLevels.includes('verbose')) return;

    super.verbose(message, context || 'NEST');

    const newLog = this.createLog({
      message,
      context,
      level: 'verbose',
    });
    this.writeToLogFile('verbose', newLog);
  }

  private checkSizeAndCreateFile(type: string) {
    try {
      const filePath =
        type === 'error' ? this.errorLogsFilePath : this.logsFilePath;
      const stat = fs.statSync(filePath);
      const fileSize = Math.round(stat.size);
      if (fileSize < this.maxLogFileSize) {
        return;
      } else {
        if (type === 'error') {
          this.errorLogsFilePath = this.createLogFile('error');
        } else {
          this.logsFilePath = this.createLogFile('log');
        }
      }
    } catch (error) {
      return null;
    }
  }

  private createLogFile(type: string) {
    const logFilePath = path.join(
      this.logsFolderPath,
      `${new Date().toISOString()}-${type}.log`,
    );
    return logFilePath;
  }

  private writeToLogFile(type: string, message: any) {
    try {
      this.checkSizeAndCreateFile(type);
      const filePath =
        type === 'error' ? this.errorLogsFilePath : this.logsFilePath;
      appendFileSync(filePath, message, 'utf-8');
    } catch (error) {
      console.error(ErrorMessage.ERROR_WRITING_TO_FILE, error.stack);
    }
  }
}
