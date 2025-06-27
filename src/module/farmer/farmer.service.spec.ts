import { Test, TestingModule } from '@nestjs/testing';
import { FarmerService } from './farmer.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import { mockCreateFarmerDto, mockFarmer, mockFarmers, mockPrismaService, mockUpdatedFarmer } from '../../mocks/farmer.mock';
import { HashingServiceProtocol } from '../auth/hash/hashing.service';

describe('FarmerService', () => {
  let service: FarmerService;
  let prisma: PrismaService;
  let hashingService: HashingServiceProtocol;

  const mockHashingService = {
    hash: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmerService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: HashingServiceProtocol,
          useValue: mockHashingService,
        },
      ],
    }).compile();

    service = module.get<FarmerService>(FarmerService);
    prisma = module.get<PrismaService>(PrismaService);
    hashingService = module.get<HashingServiceProtocol>(HashingServiceProtocol);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a farmer successfully', async () => {
    const hashedPassword = 'hashedPassword123';
    const expectedResult = {
      id: 1,
      name: mockCreateFarmerDto.name,
      email: mockCreateFarmerDto.email,
    };

    mockPrismaService.farmer.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    mockHashingService.hash.mockResolvedValue(hashedPassword);
    mockPrismaService.farmer.create.mockResolvedValue(expectedResult);

    const result = await service.create(mockCreateFarmerDto);

    expect(result).toEqual(expectedResult);
    expect(prisma.farmer.findUnique).toHaveBeenCalledWith({
      where: { document: mockCreateFarmerDto.document }
    });
    expect(prisma.farmer.findUnique).toHaveBeenCalledWith({
      where: { email: mockCreateFarmerDto.email }
    });
    expect(hashingService.hash).toHaveBeenCalledWith(mockCreateFarmerDto.password);
    expect(prisma.farmer.create).toHaveBeenCalledWith({
      data: {
        name: mockCreateFarmerDto.name,
        document: mockCreateFarmerDto.document,
        email: mockCreateFarmerDto.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  });

  it('should throw an error if document already exists when creating', async () => {
    mockPrismaService.farmer.findUnique.mockResolvedValue(mockFarmer);

    await expect(service.create(mockCreateFarmerDto)).rejects.toThrow(
      new HttpException(MESSAGES.FARMER.CONFLICT_DOCUMENT, HttpStatus.CONFLICT),
    );
  });

  it('should throw an error if email already exists when creating', async () => {
    mockPrismaService.farmer.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(mockFarmer);

    await expect(service.create(mockCreateFarmerDto)).rejects.toThrow(
      new HttpException(MESSAGES.FARMER.CONFLICT_EMAIL, HttpStatus.CONFLICT),
    );
  });

  it('should find a farmer by id successfully', async () => {
    const expectedResult = {
      id: 1,
      name: mockFarmer.name,
      email: mockFarmer.email,
      Farm: [],
    };

    mockPrismaService.farmer.findFirst.mockResolvedValue(expectedResult);

    const result = await service.findOne(1);

    expect(result).toEqual(expectedResult);
    expect(prisma.farmer.findFirst).toHaveBeenCalledWith({
      where: { id: 1 },
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
    });
  });

  it('should throw an error if farmer is not found when finding by id', async () => {
    mockPrismaService.farmer.findFirst.mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(
      new HttpException(MESSAGES.FARMER.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });

  it('should return all farmers successfully', async () => {
    const expectedResult = [
      {
        id: 1,
        name: 'Test Farmer 1',
        email: 'test1@email.com',
        Farm: [],
      },
      {
        id: 2,
        name: 'Test Farmer 2',
        email: 'test2@email.com',
        Farm: [],
      },
    ];

    mockPrismaService.farmer.findMany.mockResolvedValue(expectedResult);

    const result = await service.findAll();

    expect(result).toEqual(expectedResult);
    expect(prisma.farmer.findMany).toHaveBeenCalledWith({
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

    const existingFarmer = {
      id: 1,
      name: 'Original Farmer',
      email: 'test@email.com',
      Farm: [],
    };

    const expectedResult = {
      id: 1,
      name: 'Updated Farmer',
      email: 'test@email.com',
    };

    mockPrismaService.farmer.findFirst.mockResolvedValue(existingFarmer);
    mockPrismaService.farmer.update.mockResolvedValue(expectedResult);

    const result = await service.updateById(1, updateFarmerDto);

    expect(result).toEqual(expectedResult);
    expect(prisma.farmer.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        name: 'Updated Farmer',
        email: 'test@email.com',
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  });

  it('should update a farmer with password successfully', async () => {
    const updateFarmerDto = {
      name: 'Updated Farmer',
      password: 'newPassword123',
    };

    const hashedPassword = 'hashedNewPassword123';
    const existingFarmer = {
      id: 1,
      name: 'Original Farmer',
      email: 'test@email.com',
      Farm: [],
    };

    const expectedResult = {
      id: 1,
      name: 'Updated Farmer',
      email: 'test@email.com',
    };

    mockPrismaService.farmer.findFirst.mockResolvedValue(existingFarmer);
    mockHashingService.hash.mockResolvedValue(hashedPassword);
    mockPrismaService.farmer.update.mockResolvedValue(expectedResult);

    const result = await service.updateById(1, updateFarmerDto);

    expect(result).toEqual(expectedResult);
    expect(hashingService.hash).toHaveBeenCalledWith('newPassword123');
    expect(prisma.farmer.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        name: 'Updated Farmer',
        email: 'test@email.com',
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  });

  it('should throw an error if farmer is not found when updating', async () => {
    const updateFarmerDto = {
      name: 'Updated Farmer',
    };

    mockPrismaService.farmer.findFirst.mockResolvedValue(null);

    await expect(service.updateById(1, updateFarmerDto)).rejects.toThrow(
      new HttpException(MESSAGES.FARMER.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });

  it('should delete a farmer successfully', async () => {
    const existingFarmer = {
      id: 1,
      name: 'Test Farmer',
      email: 'test@email.com',
      Farm: [],
    };

    mockPrismaService.farmer.findFirst.mockResolvedValue(existingFarmer);
    mockPrismaService.farmer.delete.mockResolvedValue(existingFarmer);

    const result = await service.deleteById(1);

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

    await expect(service.deleteById(1)).rejects.toThrow(
      new HttpException(MESSAGES.FARMER.NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });
}); 