import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  //const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const logger = new Logger('Main');

  app.setGlobalPrefix('api');
  app.useStaticAssets(
    join(__dirname, '..', process.env.UPLOAD_FILE_PATH),
      {prefix: `/${process.env.UPLOAD_FILE_PATH}/`},
  );
  app.useStaticAssets(
    join(__dirname, '..', process.env.STORE_FILE_PATH),
      {prefix: `/${process.env.STORE_FILE_PATH}/`},
  );

  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
