import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Get ConfigService to access environment variables reliably
  const configService = app.get(ConfigService);
  const frontendUrl = configService.getOrThrow('FRONTEND_URL');
  const port = configService.getOrThrow('PORT');
  const nodeEnv = configService.getOrThrow('NODE_ENV');

  // Apply essential security middleware
  app.use(helmet());
  app.useLogger(app.get(Logger));

  // Enable CORS
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

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

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Apply global exception filter
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  // Enable graceful shutdown
  // This ensures that the application listens for shutdown signals (e.g., SIGTERM)
  // and correctly triggers the OnModuleDestroy lifecycle hook in services like PrismaService.
  // Swagger API Documentation (enabled in development and production)
  const config = new DocumentBuilder()
    .setTitle('SecureGuard API')
    .setDescription('The official API for the SecureGuard platform.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth()
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.enableShutdownHooks();

  const logger = app.get(Logger);
  await app.listen(port, () => {
    logger.log(`🚀 SecureGuard API is running on: http://localhost:${port}/api`);
    logger.log(`🔒 CORS enabled for origin: ${frontendUrl}`);
    logger.log(`📚 Swagger Docs available at: http://localhost:${port}/api-docs`);
  });
}

bootstrap();

