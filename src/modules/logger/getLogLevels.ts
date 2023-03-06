import { LogLevel } from '@nestjs/common/services/logger.service';
import 'dotenv/config';

export function getLogLevels(): LogLevel[] {
  const level = Number(process.env.LOG_LEVEL);
  const levels = ['error', 'warn', 'log', 'verbose', 'debug'] as LogLevel[];
  return levels.slice(0, level);
}
