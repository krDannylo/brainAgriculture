import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HarvestSeasonController } from './harvest-season.controller';
import { HarvestSeasonService } from './harvest-season.service';

@Module({
  imports: [PrismaModule],
  controllers: [HarvestSeasonController],
  providers: [HarvestSeasonService]
})
export class HarvestSeasonModule { }
