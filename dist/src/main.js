"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const frontendUrl = configService.get('FRONTEND_URL') || 'http://localhost:5173';
    app.enableCors({
        origin: frontendUrl,
        credentials: true,
    });
    console.log(`CORS enabled for origin: ${frontendUrl}`);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.setGlobalPrefix('api');
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 SecureGuard API is running on: http://localhost:${port}/api`);
}
bootstrap().catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map