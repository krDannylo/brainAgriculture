import { Test, TestingModule } from '@nestjs/testing';
import { FarmService } from './farm.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import { mockCreateFarmDto, mockFarm, mockFarms, mockPrismaService, mockUpdatedFarm } from '../../mocks/farm.mock';

describe('FarmService', () => {
  let service: FarmService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FarmService>(FarmService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a farm successfully', async () => {
    mockPrismaService.farm.create.mockResolvedValue(mockFarm);

    const result = await service.createOne(mockCreateFarmDto);

    expect(result).toEqual(mockFarm);
    expect(prisma.farm.create).toHaveBeenCalledWith({
      data: {
        name: mockCreateFarmDto.name,
        city: mockCreateFarmDto.city,
        state: mockCreateFarmDto.state,
        totalArea: mockCreateFarmDto.totalArea,
        arableArea: mockCreateFarmDto.arableArea,
        vegetationArea: mockCreateFarmDto.vegetationArea,
        farmerId: mockCreateFarmDto.farmerId,
      },
    });
  });

  it('should find a farm by id successfully', async () => {
    mockPrismaService.farm.findFirst.mockResolvedValue(mockFarm);

    const result = await service.findOne(1);

    expect(result).toEqual(mockFarm);
    expect(prisma.farm.findFirst).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw an error if farm is not found when finding by id', async () => {
    mockPrismaService.farm.findFirst.mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(
      new HttpException(MESSAGES.FARM.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });

  it('should return all farms successfully', async () => {
    mockPrismaService.farm.findMany.mockResolvedValue(mockFarms);

    const result = await service.findAll();

    expect(result).toEqual(mockFarms);
    expect(prisma.farm.findMany).toHaveBeenCalled();
  });

  it('should throw an error if no farms are found when listing all', async () => {
    mockPrismaService.farm.findMany.mockResolvedValue(null);

    await expect(service.findAll()).rejects.toThrow(
      new HttpException(MESSAGES.FARM.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });

  it('should update a farm successfully', async () => {
    const updateFarmDto = {
      name: 'Updated Farm',
      farmerId: 2,
    };

    mockPrismaService.farm.findFirst.mockResolvedValue(mockFarm);
    mockPrismaService.farmer.findUnique.mockResolvedValue({ id: 2 });
    mockPrismaService.farm.update.mockResolvedValue(mockUpdatedFarm);

    const result = await service.updateOne(1, updateFarmDto);

    expect(result).toEqual(mockUpdatedFarm);
    expect(prisma.farm.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: updateFarmDto,
    });
  });

  it('should throw an error if farm is not found when updating', async () => {
    const updateFarmDto = {
      name: 'Updated Farm',
      farmerId: 2,
    };

    mockPrismaService.farm.findFirst.mockResolvedValue(null);

    await expect(service.updateOne(1, updateFarmDto)).rejects.toThrow(
      new HttpException(MESSAGES.FARM.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });

  it('should throw an error if farmer is not found when updating', async () => {
    const updateFarmDto = {
      name: 'Updated Farm',
      farmerId: 2,
    };

    mockPrismaService.farm.findFirst.mockResolvedValue(mockFarm);
    mockPrismaService.farmer.findUnique.mockResolvedValue(null);

    await expect(service.updateOne(1, updateFarmDto)).rejects.toThrow(
      new HttpException(MESSAGES.FARMER.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });

  it('should delete a farm successfully', async () => {
    mockPrismaService.farm.findFirst.mockResolvedValue(mockFarm);
    mockPrismaService.farm.delete.mockResolvedValue(mockFarm);

    const result = await service.deleteOne(1);

    expect(result).toEqual({
      statusCode: HttpStatus.OK,
      message: MESSAGES.GENERAL.SUCCESS,
    });
    expect(prisma.farm.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw an error if farm is not found when deleting', async () => {
    mockPrismaService.farm.findFirst.mockResolvedValue(null);

    await expect(service.deleteOne(1)).rejects.toThrow(
      new HttpException(MESSAGES.FARM.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });
}); 