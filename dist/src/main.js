"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const nestjs_pino_1 = require("nestjs-pino");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const helmet_1 = __importDefault(require("helmet"));
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    const configService = app.get(config_1.ConfigService);
    const frontendUrl = configService.getOrThrow('FRONTEND_URL');
    const port = configService.getOrThrow('PORT');
    const nodeEnv = configService.getOrThrow('NODE_ENV');
    app.use((0, helmet_1.default)());
    app.useLogger(app.get(nestjs_pino_1.Logger));
    app.enableCors({
        origin: frontendUrl,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
    });
    const httpAdapterHost = app.get(core_1.HttpAdapterHost);
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter(httpAdapterHost));
    if (nodeEnv === 'development') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('SecureGuard API')
            .setDescription('The official API for the SecureGuard platform.')
            .setVersion('1.0')
            .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
        }, 'JWT-auth')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api-docs', app, document);
    }
    app.enableShutdownHooks();
    const logger = app.get(nestjs_pino_1.Logger);
    await app.listen(port, () => {
        logger.log(`🚀 SecureGuard API is running on: http://localhost:${port}/api`);
        logger.log(`🔒 CORS enabled for origin: ${frontendUrl}`);
        if (nodeEnv === 'development') {
            logger.log(`📚 Swagger Docs available at: http://localhost:${port}/api-docs`);
        }
    });
}
bootstrap();
//# sourceMappingURL=main.js.map