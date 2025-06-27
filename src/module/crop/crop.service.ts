import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCropDto } from "./dto/create-crop.dto";
import { UpdateCropDto } from "./dto/update-crop.dto";
import { MESSAGES } from "src/common/constants/messages";

@Injectable()
export class CropService {
  constructor(private readonly prisma: PrismaService,) { }

  async createOne(createCropDto: CreateCropDto) {
    const newCrop = await this.prisma.crop.create({
      data: {
        name: createCropDto.name,
        harvestSeasonId: createCropDto.harvestSeasonId
      }
    })

    return newCrop;
  }

  async createOneByFarmer(createCropDto: CreateCropDto, farmerId: number) {
    const harvestSeason = await this.prisma.harvestSeason.findFirst({
      where: {
        id: createCropDto.harvestSeasonId,
        farm: {
          farmerId: farmerId,
        },
      },
    });

    if (!harvestSeason) {
      throw new HttpException(
        MESSAGES.HARVEST.NOT_FOUND_OR_UNAUTHORIZED,
        HttpStatus.FORBIDDEN
      );
    }

    const newCrop = await this.prisma.crop.create({
      data: {
        name: createCropDto.name,
        harvestSeasonId: createCropDto.harvestSeasonId,
      },
    });

    return newCrop;
  }

  async findOne(id: number) {
    const crop = await this.prisma.crop.findFirst({
      where: { id }
    });

    if (!crop) throw new HttpException(MESSAGES.CROP.NOT_FOUND, HttpStatus.NOT_FOUND);

    return crop;
  }

  async findOneByFarmer(cropId: number, farmerId: number) {
    const crop = await this.prisma.crop.findFirst({
      where: {
        id: cropId,
        harvestSeason: {
          farm: {
            farmerId,
          },
        },
      },
      include: {
        harvestSeason: {
          include: {
            farm: true,
          },
        },
      },
    });

    if (!crop) {
      throw new HttpException(
        MESSAGES.CROP.NOT_FOUND_OR_UNAUTHORIZED,
        HttpStatus.NOT_FOUND,
      );
    }

    return crop;
  }

  async findAll() {
    const crops = await this.prisma.crop.findMany()

    if (!crops) throw new HttpException(MESSAGES.CROP.NOT_FOUND, HttpStatus.NOT_FOUND);

    return crops;
  }

  async findAllByFarmer(farmerId: number) {
    const crops = await this.prisma.crop.findMany({
      where: {
        harvestSeason: {
          farm: {
            farmerId: farmerId,
          },
        },
      },
      include: {
        harvestSeason: {
          include: {
            farm: true,
          },
        },
      },
    });

    return crops;
  }

  async updateOne(id: number, updateCropDto: UpdateCropDto) {
    const existingCrop = await this.findOne(id);

    if (!existingCrop) throw new HttpException(MESSAGES.CROP.NOT_FOUND, HttpStatus.NOT_FOUND);

    if (updateCropDto.harvestSeasonId) {
      const seasonExists = await this.prisma.harvestSeason.findUnique({
        where: { id: updateCropDto.harvestSeasonId }
      })

      if (!seasonExists) throw new HttpException(MESSAGES.HARVEST.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const updatedCrop = await this.prisma.crop.update({
      where: { id: existingCrop.id },
      data: updateCropDto
    })

    return updatedCrop;
  }

  async updateOneByFarmer(
    cropId: number,
    farmerId: number,
    dto: UpdateCropDto
  ) {
    const crop = await this.prisma.crop.findFirst({
      where: {
        id: cropId,
        harvestSeason: {
          farm: {
            farmerId,
          },
        },
      },
    });

    if (!crop) {
      throw new HttpException(
        MESSAGES.CROP.NOT_FOUND_OR_UNAUTHORIZED,
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedCrop = await this.prisma.crop.update({
      where: { id: cropId },
      data: dto,
    });

    return updatedCrop;
  }

  async deleteOne(id: number) {
    const existingCrop = await this.findOne(id)

    if (!existingCrop) throw new HttpException(MESSAGES.CROP.NOT_FOUND, HttpStatus.NOT_FOUND)

    await this.prisma.crop.delete({
      where: { id: existingCrop.id }
    })

    return { statusCode: HttpStatus.OK, message: MESSAGES.GENERAL.SUCCESS }
  }

  async deleteOneByFarmer(cropId: number, farmerId: number) {
    const crop = await this.prisma.crop.findFirst({
      where: {
        id: cropId,
        harvestSeason: {
          farm: {
            farmerId,
          },
        },
      },
    });

    if (!crop) {
      throw new HttpException(
        MESSAGES.CROP.NOT_FOUND_OR_UNAUTHORIZED,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.crop.delete({
      where: { id: cropId },
    });

    return { statusCode: HttpStatus.OK, message: MESSAGES.GENERAL.SUCCESS }
  }

}