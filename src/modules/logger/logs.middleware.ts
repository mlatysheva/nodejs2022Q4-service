import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { EOL } from 'node:os';
import { CustomLogger } from './customLogger';

@Injectable()
export class LogsMiddleware implements NestMiddleware {
  private logger: CustomLogger;

  constructor() {
    this.logger = new CustomLogger();
  }

  use(request: Request, response: Response, next: NextFunction) {
    const { method, originalUrl: url, query, body } = request;

    response.on('finish', () => {
      const { statusCode, statusMessage } = response;
      const message = `Method: ${method} URL: ${url}${EOL} query: ${JSON.stringify(
        query,
      )}${EOL} body: ${JSON.stringify(
        body,
      )}${EOL} status: ${statusCode}${EOL} message: ${statusMessage}${EOL}`;

      if (statusCode >= 500) {
        this.logger.error(message, 'HTTP');
      } else if (statusCode >= 400) {
        this.logger.warn(message, 'HTTP');
      } else {
        this.logger.log(message, 'HTTP');
      }
    });

    next();
  }
}
