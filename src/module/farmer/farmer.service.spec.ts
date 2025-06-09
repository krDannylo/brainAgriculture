import { Test, TestingModule } from '@nestjs/testing';
import { FarmerService } from './farmer.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import { mockCreateFarmerDto, mockFarmer, mockFarmers, mockPrismaService, mockUpdatedFarmer } from '../../mocks/farmer.mock';

describe('FarmerService', () => {
  let service: FarmerService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmerService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FarmerService>(FarmerService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a farmer successfully', async () => {
    mockPrismaService.farmer.findUnique.mockResolvedValue(null);
    mockPrismaService.farmer.create.mockResolvedValue(mockFarmer);

    const result = await service.create(mockCreateFarmerDto);

    expect(result).toEqual(mockFarmer);
    expect(prisma.farmer.create).toHaveBeenCalledWith({
      data: {
        name: mockCreateFarmerDto.name,
        document: mockCreateFarmerDto.document,
      },
    });
  });

  it('should throw an error if document already exists when creating', async () => {
    mockPrismaService.farmer.findUnique.mockResolvedValue(mockFarmer);

    await expect(service.create(mockCreateFarmerDto)).rejects.toThrow(
      new HttpException(MESSAGES.FARMER.CONFLICT_DOCUMENT, HttpStatus.CONFLICT),
    );
  });

  it('should find a farmer by id successfully', async () => {
    mockPrismaService.farmer.findFirst.mockResolvedValue(mockFarmer);

    const result = await service.findOne(1);

    expect(result).toEqual(mockFarmer);
    expect(prisma.farmer.findFirst).toHaveBeenCalledWith({
      where: { id: 1 },
      include: {
        Farm: true,
      },
    });
  });

  it('should throw an error if farmer is not found when finding by id', async () => {
    mockPrismaService.farmer.findFirst.mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(
      new HttpException(MESSAGES.FARMER.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });

  it('should return all farmers successfully', async () => {
    mockPrismaService.farmer.findMany.mockResolvedValue(mockFarmers);

    const result = await service.findAll();

    expect(result).toEqual(mockFarmers);
    expect(prisma.farmer.findMany).toHaveBeenCalledWith({
      include: {
        Farm: true,
      },
    });
  });

  it('should throw an error if no farmers are found when listing all', async () => {
    mockPrismaService.farmer.findMany.mockResolvedValue(null);

    await expect(service.findAll()).rejects.toThrow(
      new HttpException(MESSAGES.FARMER.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });

  it('should update a farmer successfully', async () => {
    const updateFarmerDto = {
      name: 'Updated Farmer',
    };

    mockPrismaService.farmer.findFirst.mockResolvedValue(mockFarmer);
    mockPrismaService.farmer.update.mockResolvedValue(mockUpdatedFarmer);

    const result = await service.updateOne(1, updateFarmerDto);

    expect(result).toEqual(mockUpdatedFarmer);
    expect(prisma.farmer.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: updateFarmerDto,
    });
  });

  it('should throw an error if farmer is not found when updating', async () => {
    const updateFarmerDto = {
      name: 'Updated Farmer',
    };

    mockPrismaService.farmer.findFirst.mockResolvedValue(null);

    await expect(service.updateOne(1, updateFarmerDto)).rejects.toThrow(
      new HttpException(MESSAGES.FARMER.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });

  it('should delete a farmer successfully', async () => {
    mockPrismaService.farmer.findFirst.mockResolvedValue(mockFarmer);
    mockPrismaService.farmer.delete.mockResolvedValue(mockFarmer);

    const result = await service.deleteOne(1);

    expect(result).toEqual({
      statusCode: HttpStatus.OK,
      message: MESSAGES.GENERAL.SUCCESS,
    });
    expect(prisma.farmer.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw an error if farmer is not found when deleting', async () => {
    mockPrismaService.farmer.findFirst.mockResolvedValue(null);

    await expect(service.deleteOne(1)).rejects.toThrow(
      new HttpException(MESSAGES.FARMER.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });
}); 