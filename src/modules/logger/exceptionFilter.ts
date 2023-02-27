import { CustomLogger } from './customLogger';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private logger: CustomLogger;
  constructor() {
    this.logger = new CustomLogger('APP');
  }
  async catch(exception, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const { getRequest, getResponse } = context;

    const { method, originalUrl } = getRequest();
    const response = getResponse();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()['message']
        : 'Internal server error';

    if (!(exception instanceof HttpException)) {
      this.logger.error(
        `${new Date().toUTCString()} Exception at: method: ${method}, url: ${originalUrl}, status: ${statusCode}, message: ${message}`,
      );
    }

    response
      .status(statusCode)
      .json({ method, originalUrl, statusCode, message });
  }
}
