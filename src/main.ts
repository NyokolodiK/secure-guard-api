import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get ConfigService to access environment variables reliably
  const configService = app.get(ConfigService);
  const frontendUrl = configService.get('FRONTEND_URL') || 'http://localhost:5173';

  // Enable CORS
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  console.log(`CORS enabled for origin: ${frontendUrl}`);

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Set global prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 SecureGuard API is running on: http://localhost:${port}/api`);
}
bootstrap().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
