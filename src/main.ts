import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get ConfigService to access environment variables reliably
  const configService = app.get(ConfigService);
  const frontendUrl = configService.getOrThrow('FRONTEND_URL');
  const port = configService.getOrThrow('PORT');
  const nodeEnv = configService.getOrThrow('NODE_ENV');

  // Apply essential security middleware
  app.use(helmet());
  app.use(compression());

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

  // Enable graceful shutdown
  // This ensures that the application listens for shutdown signals (e.g., SIGTERM)
  // and correctly triggers the OnModuleDestroy lifecycle hook in services like PrismaService.
  // Swagger API Documentation
  if (nodeEnv === 'development') {
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
  }

  app.enableShutdownHooks();

  await app.listen(port);

  console.log(`🚀 SecureGuard API is running on: http://localhost:${port}/api`);
  console.log(`🔒 CORS enabled for origin: ${frontendUrl}`);
}

bootstrap().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});

