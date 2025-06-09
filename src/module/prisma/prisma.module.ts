import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Permito que outros modules importe o Prisma Service
})
export class PrismaModule { }
