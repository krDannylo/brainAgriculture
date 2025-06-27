import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { MESSAGES } from 'src/common/constants/messages';
import logger from 'src/common/utils/logger.utils';
import { HashingServiceProtocol } from '../auth/hash/hashing.service';

const LOG_CONST = "[FarmerService]"

@Injectable()
export class FarmerService {
  constructor(
    private prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol
  ) { }

  async create(createFarmerDto: CreateFarmerDto) {
    //logger.info(`${LOG_CONST} - create`)

    //! OTIMIZAR ESSA LÓGICA FUTURAMENTE
    const existingFarmer = await this.prisma.farmer.findUnique({
      where: { document: createFarmerDto.document }
    })

    if (existingFarmer) throw new HttpException(MESSAGES.FARMER.CONFLICT_DOCUMENT, HttpStatus.CONFLICT)

    const existingEmail = await this.prisma.farmer.findUnique({
      where: { email: createFarmerDto.email }
    })

    if (existingEmail) throw new HttpException(MESSAGES.FARMER.CONFLICT_EMAIL, HttpStatus.CONFLICT)
    //! OTIMIZAR ESSA LÓGICA FUTURAMENTE

    const passwordHash = await this.hashingService.hash(createFarmerDto.password)

    const newFarmer = await this.prisma.farmer.create({
      data: {
        name: createFarmerDto.name,
        document: createFarmerDto.document,
        email: createFarmerDto.email,
        password: passwordHash
      },
      select: {
        id: true,
        name: true,
        email: true,
      }
    })

    return newFarmer;
  }

  async findOne(id: number) {
    const farmer = await this.prisma.farmer.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        Farm: {
          include: {
            HarvestSeason: {
              include: {
                Crop: true,
              },
            },
          },
        },
      },
    });


    if (!farmer) throw new HttpException(MESSAGES.FARMER.NOT_FOUND, HttpStatus.NOT_FOUND);

    return farmer;
  }

  async findAll() {
    const farmers = await this.prisma.farmer.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        Farm: {
          include: {
            HarvestSeason: {
              include: {
                Crop: true,
              },
            },
          },
        },
      },
    })

    if (!farmers) throw new HttpException(MESSAGES.FARMER.NOT_FOUND, HttpStatus.NOT_FOUND);

    return farmers;
  }

  async updateById(id: number, updateFarmerDto: UpdateFarmerDto) {
    console.log(updateFarmerDto)
    const existingFarmer = await this.findOne(id)

    if (!existingFarmer) throw new HttpException(MESSAGES.FARMER.NOT_FOUND, HttpStatus.NOT_FOUND)

    const updateData: { name?: string, email?: string, password?: string } = {
      name: updateFarmerDto.name ? updateFarmerDto.name : existingFarmer.name,
      email: updateFarmerDto.email ? updateFarmerDto.email : existingFarmer.email
    }

    if (updateFarmerDto?.password) {
      updateData.password = await this.hashingService.hash(updateFarmerDto.password)
    }

    const updatedFarmer = await this.prisma.farmer.update({
      where: { id: existingFarmer.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
      }
    })

    return updatedFarmer;
  }

  async deleteById(id: number) {
    const existingFarmer = await this.findOne(id)

    if (!existingFarmer) throw new HttpException(MESSAGES.FARMER.NOT_FOUND, HttpStatus.NOT_FOUND)

    await this.prisma.farmer.delete({
      where: { id: existingFarmer.id }
    })

    return { statusCode: HttpStatus.OK, message: MESSAGES.GENERAL.SUCCESS }
  }

}
