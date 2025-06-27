import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { HealthService, HealthStatus } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getHealth(): Promise<HealthStatus> {
    return this.healthService.checkHealth();
  }

  @Get('ready')
  @HttpCode(HttpStatus.OK)
  async getReadiness(): Promise<{ status: 'ok' | 'error' }> {
    return this.healthService.checkReadiness();
  }
} 