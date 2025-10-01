import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get API information' })
  @ApiResponse({ 
    status: 200, 
    description: 'API information and welcome message',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Welcome to SecureGuard API' },
        version: { type: 'string', example: '1.0.0' },
        docs: { type: 'string', example: '/api-docs' },
        api: { type: 'string', example: '/api' }
      }
    }
  })
  getApiInfo() {
    return {
      message: 'Welcome to SecureGuard API',
      version: '1.0.0',
      docs: '/api-docs',
      api: '/api'
    };
  }
}
