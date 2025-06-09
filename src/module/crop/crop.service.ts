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

  async findOne(id: number) {
    const crop = await this.prisma.crop.findFirst({
      where: { id }
    });

    if (!crop) throw new HttpException(MESSAGES.CROP.NOT_FOUND, HttpStatus.NOT_FOUND);

    return crop;
  }

  async findAll() {
    const crop = await this.prisma.crop.findMany()

    if (!crop) throw new HttpException(MESSAGES.CROP.NOT_FOUND, HttpStatus.NOT_FOUND);

    return crop;
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

  async deleteOne(id: number) {
    const existingCrop = await this.findOne(id)

    if (!existingCrop) throw new HttpException(MESSAGES.CROP.NOT_FOUND, HttpStatus.NOT_FOUND)

    await this.prisma.crop.delete({
      where: { id: existingCrop.id }
    })

    return { statusCode: HttpStatus.OK, message: MESSAGES.GENERAL.SUCCESS }
  }
}