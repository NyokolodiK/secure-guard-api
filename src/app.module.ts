import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { validationSchema } from './config/environment.schema';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty' }
          : undefined,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute in milliseconds
        limit: 60, // 60 requests per minute
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    BookingsModule,
    ReviewsModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

