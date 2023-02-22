import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { parse } from 'yaml';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { dirname, join, resolve } from 'path';
import { cwd } from 'node:process';
import { readFile } from 'fs/promises';
// import getLogLevels from './modules/logger/getLogLevels';
import { CustomLogger } from './modules/logger/customLogger';
import getLogLevels from './modules/logger/getLogLevels';

dotenv.config({ path: resolve(cwd(), '.env') });

async function bootstrap() {
  const port = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(true),
    bufferLogs: true,
  });
  // app.useLogger(app.get(CustomLogger));

  const rootDirname = dirname(__dirname);
  const DOC_API = await readFile(join(rootDirname, 'doc', 'api.yaml'), 'utf-8');
  const document = parse(DOC_API);
  SwaggerModule.setup('doc', app, document);

  await app.listen(port);
}
bootstrap();
