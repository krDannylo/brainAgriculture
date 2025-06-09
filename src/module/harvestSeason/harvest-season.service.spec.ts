import { Test, TestingModule } from '@nestjs/testing';
import { HarvestSeasonService } from './harvest-season.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import {
  mockCreateHarvestSeasonDto,
  mockHarvestSeason,
  mockHarvestSeasons,
  mockPrismaService,
  mockUpdateHarvestSeasonDto,
  mockUpdatedHarvestSeason,
} from '../../mocks/harvestSeason.mock';

describe('HarvestSeasonService', () => {
  let service: HarvestSeasonService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestSeasonService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<HarvestSeasonService>(HarvestSeasonService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a harvest season successfully', async () => {
    mockPrismaService.farm.findUnique.mockResolvedValue({ id: 1 });
    mockPrismaService.harvestSeason.create.mockResolvedValue(mockHarvestSeason);

    const result = await service.createOne(mockCreateHarvestSeasonDto);

    expect(result).toEqual(mockHarvestSeason);
    expect(prisma.harvestSeason.create).toHaveBeenCalledWith({
      data: {
        year: mockCreateHarvestSeasonDto.year,
        farm: {
          connect: { id: mockCreateHarvestSeasonDto.farmId },
        },
      },
    });
  });

  it('should throw an error if farm is not found when creating', async () => {
    mockPrismaService.farm.findUnique.mockResolvedValue(null);

    await expect(service.createOne(mockCreateHarvestSeasonDto)).rejects.toThrow(
      new HttpException(MESSAGES.FARM.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });

  it('should find a harvest season by id successfully', async () => {
    mockPrismaService.harvestSeason.findFirst.mockResolvedValue(mockHarvestSeason);

    const result = await service.findOne(1);

    expect(result).toEqual(mockHarvestSeason);
    expect(prisma.harvestSeason.findFirst).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw an error if harvest season is not found when finding by id', async () => {
    mockPrismaService.harvestSeason.findFirst.mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(
      new HttpException(MESSAGES.HARVEST.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });

  it('should return all harvest seasons successfully', async () => {
    mockPrismaService.harvestSeason.findMany.mockResolvedValue(mockHarvestSeasons);

    const result = await service.findAll();

    expect(result).toEqual(mockHarvestSeasons);
    expect(prisma.harvestSeason.findMany).toHaveBeenCalled();
  });

  it('should throw an error if no harvest seasons are found when listing all', async () => {
    mockPrismaService.harvestSeason.findMany.mockResolvedValue(null);

    await expect(service.findAll()).rejects.toThrow(
      new HttpException(MESSAGES.HARVEST.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });

  it('should update a harvest season successfully', async () => {
    mockPrismaService.harvestSeason.findFirst.mockResolvedValue(mockHarvestSeason);
    mockPrismaService.farm.findUnique.mockResolvedValue({ id: 2 });
    mockPrismaService.harvestSeason.update.mockResolvedValue(mockUpdatedHarvestSeason);

    const result = await service.updateOne(1, mockUpdateHarvestSeasonDto);

    expect(result).toEqual(mockUpdatedHarvestSeason);
    expect(prisma.harvestSeason.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: mockUpdateHarvestSeasonDto,
    });
  });

  it('should throw an error if harvest season is not found when updating', async () => {
    mockPrismaService.harvestSeason.findFirst.mockResolvedValue(null);

    await expect(service.updateOne(1, mockUpdateHarvestSeasonDto)).rejects.toThrow(
      new HttpException(MESSAGES.HARVEST.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });

  it('should throw an error if farm is not found when updating', async () => {
    mockPrismaService.harvestSeason.findFirst.mockResolvedValue(mockHarvestSeason);
    mockPrismaService.farm.findUnique.mockResolvedValue(null);

    await expect(service.updateOne(1, mockUpdateHarvestSeasonDto)).rejects.toThrow(
      new HttpException(MESSAGES.FARM.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });

  it('should delete a harvest season successfully', async () => {
    mockPrismaService.harvestSeason.findFirst.mockResolvedValue(mockHarvestSeason);
    mockPrismaService.harvestSeason.delete.mockResolvedValue(mockHarvestSeason);

    const result = await service.deleteOne(1);

    expect(result).toEqual({
      statusCode: HttpStatus.OK,
      message: MESSAGES.GENERAL.SUCCESS,
    });
    expect(prisma.harvestSeason.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw an error if harvest season is not found when deleting', async () => {
    mockPrismaService.harvestSeason.findFirst.mockResolvedValue(null);

    await expect(service.deleteOne(1)).rejects.toThrow(
      new HttpException(MESSAGES.HARVEST.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });
}); 