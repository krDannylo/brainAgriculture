import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { MESSAGES } from 'src/common/constants/messages';
import logger from 'src/common/utils/logger.utils';

const LOG_CONST = "[FarmerService]"

@Injectable()
export class FarmerService {
  constructor(private prisma: PrismaService) { }

  async create(createFarmerDto: CreateFarmerDto) {
    logger.info(`${LOG_CONST} - create`)
    const existingFarmer = await this.prisma.farmer.findUnique({
      where: { document: createFarmerDto.document }
    })

    if (existingFarmer) throw new HttpException(MESSAGES.FARMER.CONFLICT_DOCUMENT, HttpStatus.CONFLICT)

    const newFarmer = await this.prisma.farmer.create({
      data: {
        name: createFarmerDto.name,
        document: createFarmerDto.document
      }
    })

    return newFarmer;
  }

  async findOne(id: number) {
    const farmer = await this.prisma.farmer.findFirst({
      where: { id },
      include: {
        Farm: true,
      }
    })

    if (!farmer) throw new HttpException(MESSAGES.FARMER.NOT_FOUND, HttpStatus.NOT_FOUND);

    return farmer;
  }

  async findAll() {
    const farmer = await this.prisma.farmer.findMany({
      include: {
        Farm: true,
      }
    })

    if (!farmer) throw new HttpException(MESSAGES.FARMER.NOT_FOUND, HttpStatus.NOT_FOUND);

    return farmer;
  }

  async updateOne(id: number, updateFarmerDto: UpdateFarmerDto) {
    const existingFarmer = await this.findOne(id)

    if (!existingFarmer) throw new HttpException(MESSAGES.FARMER.NOT_FOUND, HttpStatus.NOT_FOUND)

    const updatedFarmer = await this.prisma.farmer.update({
      where: { id: existingFarmer.id },
      data: updateFarmerDto
    })

    return updatedFarmer;
  }

  async deleteOne(id: number) {
    const existingFarmer = await this.findOne(id)

    if (!existingFarmer) throw new HttpException(MESSAGES.FARMER.NOT_FOUND, HttpStatus.NOT_FOUND)

    await this.prisma.farmer.delete({
      where: { id: existingFarmer.id }
    })

    return { statusCode: HttpStatus.OK, message: MESSAGES.GENERAL.SUCCESS }
  }

}
