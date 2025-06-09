import { Test, TestingModule } from '@nestjs/testing';
import { CropService } from './crop.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import { mockCreateCropDto, mockCrop, mockCrops, mockPrismaService, mockUpdatedCrop } from '../../mocks/crop.mock';

describe('CropService', () => {
  let service: CropService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CropService>(CropService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a crop successfully', async () => {
    mockPrismaService.crop.create.mockResolvedValue(mockCrop);

    const result = await service.createOne(mockCreateCropDto);

    expect(result).toEqual(mockCrop);
    expect(prisma.crop.create).toHaveBeenCalledWith({
      data: {
        name: mockCreateCropDto.name,
        harvestSeasonId: mockCreateCropDto.harvestSeasonId,
      },
    });
  });

  it('should find a crop by id successfully', async () => {
    mockPrismaService.crop.findFirst.mockResolvedValue(mockCrop);

    const result = await service.findOne(1);

    expect(result).toEqual(mockCrop);
    expect(prisma.crop.findFirst).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw an error if crop is not found when finding by id', async () => {
    mockPrismaService.crop.findFirst.mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(
      new HttpException(MESSAGES.CROP.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });

  it('should return all crops successfully', async () => {
    mockPrismaService.crop.findMany.mockResolvedValue(mockCrops);

    const result = await service.findAll();

    expect(result).toEqual(mockCrops);
    expect(prisma.crop.findMany).toHaveBeenCalled();
  });

  it('should throw an error if no crops are found when listing all', async () => {
    mockPrismaService.crop.findMany.mockResolvedValue(null);

    await expect(service.findAll()).rejects.toThrow(
      new HttpException(MESSAGES.CROP.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });

  it('should update a crop successfully', async () => {
    const updateCropDto = {
      name: 'Updated Crop',
      harvestSeasonId: 2,
    };

    mockPrismaService.crop.findFirst.mockResolvedValue(mockCrop);
    mockPrismaService.harvestSeason.findUnique.mockResolvedValue({ id: 2 });
    mockPrismaService.crop.update.mockResolvedValue(mockUpdatedCrop);

    const result = await service.updateOne(1, updateCropDto);

    expect(result).toEqual(mockUpdatedCrop);
    expect(prisma.crop.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: updateCropDto,
    });
  });

  it('should throw an error if crop is not found when updating', async () => {
    const updateCropDto = {
      name: 'Updated Crop',
      harvestSeasonId: 2,
    };

    mockPrismaService.crop.findFirst.mockResolvedValue(null);

    await expect(service.updateOne(1, updateCropDto)).rejects.toThrow(
      new HttpException(MESSAGES.CROP.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });

  it('should throw an error if harvest season is not found when updating', async () => {
    const updateCropDto = {
      name: 'Updated Crop',
      harvestSeasonId: 2,
    };

    mockPrismaService.crop.findFirst.mockResolvedValue(mockCrop);
    mockPrismaService.harvestSeason.findUnique.mockResolvedValue(null);

    await expect(service.updateOne(1, updateCropDto)).rejects.toThrow(
      new HttpException(MESSAGES.HARVEST.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });

  it('should delete a crop successfully', async () => {
    mockPrismaService.crop.findFirst.mockResolvedValue(mockCrop);
    mockPrismaService.crop.delete.mockResolvedValue(mockCrop);

    const result = await service.deleteOne(1);

    expect(result).toEqual({
      statusCode: HttpStatus.OK,
      message: MESSAGES.GENERAL.SUCCESS,
    });
    expect(prisma.crop.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw an error if crop is not found when deleting', async () => {
    mockPrismaService.crop.findFirst.mockResolvedValue(null);

    await expect(service.deleteOne(1)).rejects.toThrow(
      new HttpException(MESSAGES.CROP.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });
}); 