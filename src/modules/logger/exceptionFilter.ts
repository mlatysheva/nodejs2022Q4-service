import { CustomLogger } from './customLogger';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private logger: CustomLogger;
  constructor() {
    this.logger = new CustomLogger();
  }
  async catch(exception, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const { method, originalUrl } = request;

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()['message']
        : 'Internal server error';

    const logMessage = `${new Date().toUTCString()} method: ${method}, url: ${originalUrl}, status: ${statusCode}, message: ${message}`;

    if (!(exception instanceof HttpException)) {
      this.logger.error(logMessage, 'EXCEPTION_FILTER');
    }

    response
      .status(statusCode)
      .json({ method, originalUrl, statusCode, message });
  }
}
