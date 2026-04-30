import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Autorise les requêtes du frontend Next.js
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  });

  // Valide automatiquement tous les DTO et rejette les champs inconnus
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Backend démarré sur le port ${port}`);
}

bootstrap();
