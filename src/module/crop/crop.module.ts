import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CropCrontroller } from './crop.controller';
import { CropService } from './crop.service';

@Module({
  imports: [PrismaModule],
  controllers: [CropCrontroller],
  providers: [CropService]
})
export class CropModule { }
