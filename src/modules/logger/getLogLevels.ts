import { LogLevel } from '@nestjs/common/services/logger.service';
import 'dotenv/config';

export function getLogLevels2(isProduction: boolean): LogLevel[] {
  if (isProduction) {
    return ['log', 'warn', 'error'];
  }
  return ['error', 'warn', 'log', 'verbose', 'debug'];
}

export function getLogLevels(): LogLevel[] {
  const level = Number(process.env.LOG_LEVEL);
  const levels = ['error', 'warn', 'log', 'verbose', 'debug'] as LogLevel[];
  return levels.slice(0, level);
}
