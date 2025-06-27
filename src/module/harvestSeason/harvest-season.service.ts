import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateHarvestSeasonDto } from "./dto/create-harvest-season.dto";
import { UpdateHarvestSeasonDto } from "./dto/update-harvest-season.dto";
import { MESSAGES } from "src/common/constants/messages";

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