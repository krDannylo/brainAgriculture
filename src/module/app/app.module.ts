import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FarmerModule } from '../farmer/farmer.module';
import { FarmModule } from '../farm/farm.module';
import { HarvestSeasonModule } from '../harvestSeason/harvest-season.module';
import { CropModule } from '../crop/crop.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { AuthModule } from '../auth/auth.module';
import { HealthModule } from '../health/health.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    PrismaModule,
    FarmerModule,
    FarmModule,
    HarvestSeasonModule,
    CropModule,
    DashboardModule,
    AuthModule,
    HealthModule,
    ThrottlerModule.forRoot({
      throttlers: [{
        ttl: 60000,
        limit: 60,
        blockDuration: 30000,
      }]
    })
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule { }
