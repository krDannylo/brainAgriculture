import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FarmController } from './farm.controller';
import { FarmService } from './farm.service';

@Module({
  imports: [PrismaModule],
  controllers: [FarmController],
  providers: [FarmService]
})
export class FarmModule { }
