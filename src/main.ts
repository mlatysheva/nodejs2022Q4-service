import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { parse } from 'yaml';
import { AppModule } from './app.module';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';
import { CustomExceptionFilter } from './modules/logger/exceptionFilter';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { CustomLogger } from './modules/logger/customLogger';

async function bootstrap() {
  const logger = new CustomLogger(bootstrap.name);

  const port = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app
    .useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
    .useLogger(app.get(CustomLogger));
  app
    .useGlobalFilters(new CustomExceptionFilter())
    .useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

  const rootDirname = dirname(__dirname);
  const DOC_API = await readFile(join(rootDirname, 'doc', 'api.yaml'), 'utf-8');
  const document = parse(DOC_API);
  SwaggerModule.setup('doc', app, document);

  await app.listen(port);

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(
      `${new Date().toUTCString()} Unhandled Rejection at: ${promise}, reason: ${reason}`,
    );
  });

  process.on('uncaughtException', (error) => {
    logger.error(
      `${new Date().toUTCString()} Uncaught Exception at: ${
        error.message
      } stack: ${error.stack}`,
    );
    process.exit(1);
  });
}
bootstrap();
