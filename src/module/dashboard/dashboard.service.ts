import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) { }

  async getDashboardData() {
    const totalFarms = await this.prisma.farm.count();

    const totalHectaresResult = await this.prisma.farm.aggregate({
      _sum: {
        totalArea: true,
      },
    });
    const totalHectares = totalHectaresResult._sum.totalArea || 0;

    const farmsByState = await this.prisma.farm.groupBy({
      by: ['state'],
      _count: true,
    });

    const cropsByCulture = await this.prisma.crop.groupBy({
      by: ['name'],
      _count: true,
    });

    const landUsage = await this.prisma.farm.aggregate({
      _sum: {
        arableArea: true,
        vegetationArea: true,
      },
    });

    return {
      totalFarms,
      totalHectares,
      farmsByState,
      cropsByCulture,
      landUsage: {
        arable: landUsage._sum.arableArea || 0,
        vegetation: landUsage._sum.vegetationArea || 0,
      },
    };
  }
}