import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FarmerModule } from '../farmer/farmer.module';
import { FarmModule } from '../farm/farm.module';
import { HarvestSeasonModule } from '../harvestSeason/harvest-season.module';
import { CropModule } from '../crop/crop.module';
import { DashboardModule } from '../dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    FarmerModule,
    FarmModule,
    HarvestSeasonModule,
    CropModule,
    DashboardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
