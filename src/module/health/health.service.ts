import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  database: {
    status: 'connected' | 'disconnected';
    responseTime?: number;
  };
  version: string;
}

@Injectable()
export class HealthService {
  constructor(private readonly prismaService: PrismaService) { }

  async checkHealth(): Promise<HealthStatus> {
    const startTime = Date.now();
    let dbStatus: 'connected' | 'disconnected' = 'disconnected';
    let responseTime: number | undefined;

    try {
      // Test database connection
      await this.prismaService.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
      responseTime = Date.now() - startTime;
    } catch (error) {
      dbStatus = 'disconnected';
    }

    const overallStatus: 'ok' | 'error' = dbStatus === 'connected' ? 'ok' : 'error';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: dbStatus,
        responseTime,
      },
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  async checkReadiness(): Promise<{ status: 'ok' | 'error' }> {
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      return { status: 'ok' };
    } catch (error) {
      return { status: 'error' };
    }
  }
} 