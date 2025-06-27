import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { MESSAGES } from 'src/common/constants/messages';
import { mapFarmToResponseDto } from './mapper/farm.mapper';
import { ResponseFarmDto } from './dto/response-farm.dto';

@Injectable()
export class FarmService {
  constructor(private prisma: PrismaService) { }

  async createOne(createFarmDto: CreateFarmDto) {
    const newFarm = await this.prisma.farm.create({
      data: {
        name: createFarmDto.name,
        city: createFarmDto.city,
        state: createFarmDto.state,
        totalArea: createFarmDto.totalArea,
        arableArea: createFarmDto.arableArea,
        vegetationArea: createFarmDto.vegetationArea,
        farmerId: createFarmDto.farmerId
      }
    })

    return mapFarmToResponseDto(newFarm)
  }

  async findOne(id: number) {
    const farm = await this.prisma.farm.findFirst({
      where: { id }
    });

    if (!farm) throw new HttpException(MESSAGES.FARM.NOT_FOUND, HttpStatus.NOT_FOUND);

    return mapFarmToResponseDto(farm)
  }

  async findOneByFarmer(id: number, farmerId: number): Promise<ResponseFarmDto> {
    const farm = await this.prisma.farm.findFirst({
      where: { id, farmerId },
      include: {
        Farmer: true,
      },
    });

    if (!farm) throw new HttpException(MESSAGES.FARM.NOT_FOUND_OR_UNAUTHORIZED, HttpStatus.NOT_FOUND);

    return mapFarmToResponseDto(farm)
  }

  async findAll() {
    const farms = await this.prisma.farm.findMany()

    if (!farms) throw new HttpException(MESSAGES.FARM.NOT_FOUND, HttpStatus.NOT_FOUND);

    return farms.map(mapFarmToResponseDto); // farms.map(farm => mapFarmToResponseDto(farm));
  }

  async findAllByFarmer(farmerId: number): Promise<ResponseFarmDto[]> {
    const farms = await this.prisma.farm.findMany({
      where: { farmerId },
      include: { Farmer: true, HarvestSeason: true, },
    });

    if (!farms) throw new HttpException(MESSAGES.FARM.NOT_FOUND, HttpStatus.NOT_FOUND);

    return farms.map(mapFarmToResponseDto);
  }

  async updateOne(id: number, updateFarmDto: UpdateFarmDto) {
    const existingfarm = await this.findOne(id);

    if (!existingfarm) throw new HttpException(MESSAGES.FARM.NOT_FOUND, HttpStatus.NOT_FOUND);

    if (updateFarmDto.farmerId) {
      const farmerExists = await this.prisma.farmer.findUnique({
        where: { id: updateFarmDto.farmerId }
      })

      if (!farmerExists) throw new HttpException(MESSAGES.FARMER.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const updatedFarm = await this.prisma.farm.update({
      where: { id: existingfarm.id },
      data: updateFarmDto
    })

    return mapFarmToResponseDto(updatedFarm);
  }

  async updateOneByFarmer(
    id: number,
    farmerId: number,
    updateFarmDto: UpdateFarmDto,
  ): Promise<ResponseFarmDto> {
    const farm = await this.prisma.farm.findFirst({
      where: { id, farmerId },
    });

    if (!farm) {
      throw new HttpException(
        MESSAGES.FARM.NOT_FOUND_OR_UNAUTHORIZED,
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedFarm = await this.prisma.farm.update({
      where: { id },
      data: updateFarmDto,
    });

    return mapFarmToResponseDto(updatedFarm);
  }

  async deleteOne(id: number) {
    const existingFarm = await this.findOne(id)

    if (!existingFarm) throw new HttpException(MESSAGES.FARM.NOT_FOUND, HttpStatus.NOT_FOUND)

    await this.prisma.farm.delete({
      where: { id: existingFarm.id }
    })

    return { statusCode: HttpStatus.OK, message: MESSAGES.GENERAL.SUCCESS }
  }

  async deleteOneByFarmer(id: number, farmerId: number) {
    const farm = await this.prisma.farm.findFirst({
      where: { id, farmerId },
    });

    if (!farm) {
      throw new HttpException(MESSAGES.FARM.NOT_FOUND_OR_UNAUTHORIZED, HttpStatus.NOT_FOUND)
    }

    await this.prisma.farm.delete({
      where: { id },
    });

    return { statusCode: HttpStatus.OK, message: MESSAGES.GENERAL.SUCCESS }
  }
}
