import { Injectable, ConsoleLogger, Logger } from '@nestjs/common';
import { getLogLevels } from './getLogLevels';
import { CreateLogDto } from './dto/createLog.dto';
import { EOL } from 'os';
import { statSync, mkdirSync, writeFileSync, appendFileSync } from 'fs';
import { ErrorMessage } from '../../constants/errors';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private logger = new Logger('NEST');

  private logLevels = getLogLevels();
  private logsFolderPath = path.join(process.cwd(), 'logs');
  private logsFilePath: string;
  private errorLogsFilePath: string;
  private maxLogFileSize =
    Number(process.env.MAX_SIZE_LOG_FILE) * 1024 || 25 * 1024;

  constructor() {
    super();
    if (!fs.existsSync(this.logsFolderPath)) {
      fs.mkdirSync(this.logsFolderPath);
    }
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
    // this.logger.log(`this.logsFilePath: ${this.logsFilePath}`);
    this.writeToLogFile('log', newLog);
    // return newLog;
  }

  async error(message: string, context?: string | 'NEST', stack?: string) {
    if (!this.logLevels.includes('error')) return;

    super.error.apply(this, [message, stack, context || 'NEST']);

    const newLog = await this.createLog({
      message,
      context,
      level: 'error',
    });
    await this.writeToLogFile('error', newLog);
    // return newLog;
  }

  async warn(message: string, context?: string | 'NEST') {
    if (!this.logLevels.includes('warn')) return;

    super.warn.apply(this, [message, context || 'NEST']);

    const newLog = await this.createLog({
      message,
      context,
      level: 'warn',
    });
    return newLog;
  }

  async debug(message: string, context?: string | '[NEST]') {
    if (!this.logLevels.includes('debug')) return;

    super.debug.apply(this, [message, context || 'NEST']);

    const newLog = await this.createLog({
      message,
      context,
      level: 'debug',
    });
    return newLog;
  }

  async verbose(message: string, context?: string | 'NEST') {
    if (!this.logLevels.includes('verbose')) return;

    super.verbose.apply(this, [message, context]);

    const newLog = await this.createLog({
      message,
      context,
      level: 'verbose',
    });
    return newLog;
  }

  private doesFileExist(filePath: string) {
    this.logger.log(`Checking if file exists: ${filePath}`);
    try {
      fs.existsSync(filePath);
      this.logger.log(`File exists: ${filePath}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  private isFileSizeNotExceeded(filePath: string) {
    try {
      const stat = fs.statSync(filePath);
      const fileSize = Math.round(stat.size);
      if (fileSize < this.maxLogFileSize) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  }

  private writeToNewFile(filePath: string, message: string) {
    fs.writeFileSync(filePath, message, 'utf-8');
  }

  private appendToFile(filePath: string, message: string) {
    fs.appendFileSync(filePath, message, 'utf-8');
  }

  private createLogFile(type: string) {
    const logFilePath = path.join(
      this.logsFolderPath,
      `${new Date().toISOString()}-${type}.log`,
    );
    return logFilePath;
  }

  private writeToLogFile2(filePath: string, type: string, message: any) {
    this.logger.log(`Writing to file: ${filePath}`);
    try {
      if (this.doesFileExist(filePath)) {
        if (this.isFileSizeNotExceeded(filePath)) {
          this.appendToFile(filePath, message);
        } else {
          const logFilePath = this.createLogFile(type);
          this.writeToNewFile(logFilePath, message);
          if (type === 'error') {
            this.errorLogsFilePath = logFilePath;
            this.logger.log(`Error log file path: ${this.errorLogsFilePath}`);
          } else {
            this.logsFilePath = logFilePath;
            this.logger.log(`Log file path: ${this.logsFilePath}`);
          }
        }
      } else {
        this.logger.log(`File does not exist: ${filePath}`);
        const logFilePath = this.createLogFile(type);
        this.logger.log(`Creating new file: ${logFilePath}`);
        this.writeToNewFile(logFilePath, message);
        if (type === 'error') {
          this.errorLogsFilePath = logFilePath;
        } else {
          this.logsFilePath = logFilePath;
        }
      }
    } catch (error) {
      this.logger.error(ErrorMessage.ERROR_WRITING_TO_FILE, error.stack);
    }
  }

  private writeToLogFile(type: string, message: any) {
    try {
      if (type === 'error') {
        if (fs.existsSync(this.errorLogsFilePath)) {
          const stat = fs.statSync(this.errorLogsFilePath);
          const fileSize = Math.round(stat.size);
          if (fileSize < this.maxLogFileSize) {
            fs.appendFileSync(this.errorLogsFilePath, message, 'utf-8');
          } else {
            const logFilePath = path.join(
              this.logsFolderPath,
              `${new Date().toISOString()}-error.log`,
            );
            this.errorLogsFilePath = logFilePath;
            fs.writeFileSync(this.errorLogsFilePath, message, 'utf-8');
          }
        } else {
          const logFilePath = path.join(
            this.logsFolderPath,
            `${new Date().toISOString()}-error.log`,
          );
          this.errorLogsFilePath = logFilePath;
          fs.writeFileSync(this.errorLogsFilePath, message, 'utf-8');
        }
      } else {
        if (fs.existsSync(this.logsFilePath)) {
          const stat = fs.statSync(this.logsFilePath);
          const fileSize = Math.round(stat.size);
          if (fileSize < this.maxLogFileSize) {
            fs.appendFileSync(this.logsFilePath, message + EOL, 'utf-8');
          } else {
            const logFilePath = path.join(
              this.logsFolderPath,
              `${new Date().toISOString()}-log.log`,
            );
            this.logsFilePath = logFilePath;
            fs.writeFileSync(this.logsFilePath, message + EOL, 'utf-8');
          }
        } else {
          const logFilePath = path.join(
            this.logsFolderPath,
            `${new Date().toISOString()}-log.log`,
          );
          this.logsFilePath = logFilePath;
          fs.writeFileSync(this.logsFilePath, message + EOL, 'utf-8');
        }
      }
    } catch {}
  }
}
