import { CustomLogger } from './customLogger';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const { getRequest, getResponse } = host.switchToHttp();

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

    response
      .status(statusCode)
      .json({ method, originalUrl, statusCode, message });
  }
}
