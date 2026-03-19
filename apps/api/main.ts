import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './apps/api/prisma/app.module';
import { config } from '@/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useLogger(['log', 'error', 'warn']);

  app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
  }),
);

  await app.listen(config.port || 3000);
}
bootstrap();
