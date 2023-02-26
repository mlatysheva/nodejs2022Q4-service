import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { EOL } from 'node:os';

@Injectable()
export class LogsMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

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
        return this.logger.error(message);
      }

      if (statusCode >= 400) {
        return this.logger.error(message);
      }

      return this.logger.log(message);
    });

    next();
  }
}
