import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FarmerController } from './farmer.controller';
import { FarmerService } from './farmer.service';

@Module({
  imports: [PrismaModule],
  controllers: [FarmerController],
  providers: [FarmerService]
})
export class FarmerModule { }
