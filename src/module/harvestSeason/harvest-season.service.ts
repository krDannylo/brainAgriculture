import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateHarvestSeasonDto } from "./dto/create-harvest-season.dto";
import { UpdateHarvestSeasonDto } from "./dto/update-harvest-season.dto";
import { MESSAGES } from "src/common/constants/messages";
import { PaginationQueryDto, PaginationResponseDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class HarvestSeasonService {
  constructor(private readonly prisma: PrismaService) { }

  async createOne(createHarvestSeason: CreateHarvestSeasonDto) {
    if (createHarvestSeason.farmId) {
      const farmExists = await this.prisma.farm.findUnique({
        where: { id: createHarvestSeason.farmId }
      })

      if (!farmExists) throw new HttpException(MESSAGES.FARM.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const newSeason = await this.prisma.harvestSeason.create({
      data: {
        year: createHarvestSeason.year,
        farm: {
          connect: { id: createHarvestSeason.farmId },
        }
      }
    })

    return newSeason;
  }

  async createOneByFarmer(
    createHarvestSeason: CreateHarvestSeasonDto,
    farmerId: number,
  ) {
    if (!createHarvestSeason.farmId) {
      throw new BadRequestException('farmId é obrigatório.');
    }

    const farm = await this.prisma.farm.findFirst({
      where: {
        id: createHarvestSeason.farmId,
        farmerId,
      },
    });

    if (!farm) {
      throw new HttpException(
        MESSAGES.FARM.NOT_FOUND_OR_UNAUTHORIZED,
        HttpStatus.FORBIDDEN,
      );
    }

    const newSeason = await this.prisma.harvestSeason.create({
      data: {
        year: createHarvestSeason.year,
        farm: {
          connect: { id: createHarvestSeason.farmId },
        },
      },
    });

    return newSeason;
  }

  async findOne(id: number) {
    const season = await this.prisma.harvestSeason.findFirst({
      where: { id }
    });

    if (!season) throw new HttpException(MESSAGES.HARVEST.NOT_FOUND, HttpStatus.NOT_FOUND);

    return season;
  }

  async findOneByFarmer(id: number, farmerId: number) {
    const season = await this.prisma.harvestSeason.findFirst({
      where: {
        id,
        farm: {
          farmerId: farmerId,
        },
      },
      include: {
        farm: true,
      },
    });

    if (!season) {
      throw new HttpException(
        MESSAGES.HARVEST.NOT_FOUND_OR_UNAUTHORIZED,
        HttpStatus.NOT_FOUND,
      );
    }

    return season;
  }

  async findAll() {
    const seasons = await this.prisma.harvestSeason.findMany()

    if (!seasons) throw new HttpException(MESSAGES.HARVEST.NOT_FOUND, HttpStatus.NOT_FOUND);

    return seasons;
  }

  async findAllPaginated(paginationQuery: PaginationQueryDto): Promise<PaginationResponseDto<any>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const [seasons, total] = await Promise.all([
      this.prisma.harvestSeason.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' },
        include: {
          farm: {
            include: {
              Farmer: true,
            },
          },
          Crop: true,
        },
      }),
      this.prisma.harvestSeason.count(),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data: seasons,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
  }

  async findAllByFarmer(farmerId: number) {
    const harvestSeasons = await this.prisma.harvestSeason.findMany({
      where: {
        farm: {
          farmerId: farmerId,
        },
      }
    });

    return harvestSeasons;
  }

  async findAllByFarmerPaginated(
    farmerId: number,
    paginationQuery: PaginationQueryDto
  ): Promise<PaginationResponseDto<any>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const [seasons, total] = await Promise.all([
      this.prisma.harvestSeason.findMany({
        where: {
          farm: {
            farmerId: farmerId,
          },
        },
        skip,
        take: limit,
        orderBy: { id: 'asc' },
        include: {
          farm: {
            include: {
              Farmer: true,
            },
          },
          Crop: true,
        },
      }),
      this.prisma.harvestSeason.count({
        where: {
          farm: {
            farmerId: farmerId,
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data: seasons,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
  }

  async updateOne(id: number, updateHarvestSeasonDto: UpdateHarvestSeasonDto) {
    const existingSeason = await this.findOne(id);

    if (!existingSeason) throw new HttpException(MESSAGES.HARVEST.NOT_FOUND, HttpStatus.NOT_FOUND);

    if (updateHarvestSeasonDto.farmId) {
      const farmExists = await this.prisma.farm.findUnique({
        where: { id: updateHarvestSeasonDto.farmId }
      })

      if (!farmExists) throw new HttpException(MESSAGES.FARM.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const updateSeason = await this.prisma.harvestSeason.update({
      where: { id: existingSeason.id },
      data: updateHarvestSeasonDto
    })

    return updateSeason;
  }

  async updateOneByFarmer(
    id: number,
    farmerId: number,
    updateHarvestSeasonDto: UpdateHarvestSeasonDto
  ) {
    const harvestSeason = await this.prisma.harvestSeason.findFirst({
      where: {
        id,
        farm: {
          farmerId,
        },
      },
    });

    if (!harvestSeason) {
      throw new HttpException(
        MESSAGES.HARVEST.NOT_FOUND_OR_UNAUTHORIZED,
        HttpStatus.NOT_FOUND,
      );
    }

    const updateSeason = await this.prisma.harvestSeason.update({
      where: { id },
      data: updateHarvestSeasonDto,
    });

    return updateSeason;
  }

  async deleteOne(id: number) {
    const existingSeason = await this.findOne(id)

    if (!existingSeason) throw new HttpException(MESSAGES.HARVEST.NOT_FOUND, HttpStatus.NOT_FOUND)

    await this.prisma.harvestSeason.delete({
      where: { id: existingSeason.id }
    })

    return { statusCode: HttpStatus.OK, message: MESSAGES.GENERAL.SUCCESS, }
  }

  async deleteOneByFarmer(
    id: number,
    farmerId: number
  ) {
    const harvestSeason = await this.prisma.harvestSeason.findFirst({
      where: {
        id,
        farm: {
          farmerId: farmerId,
        },
      },
    });

    if (!harvestSeason) {
      throw new HttpException(
        MESSAGES.HARVEST.NOT_FOUND_OR_UNAUTHORIZED,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.harvestSeason.delete({
      where: { id },
    });

    return { statusCode: HttpStatus.OK, message: MESSAGES.GENERAL.SUCCESS }
  }

}