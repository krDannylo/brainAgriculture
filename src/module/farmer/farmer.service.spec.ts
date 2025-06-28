import { Test, TestingModule } from '@nestjs/testing';
import { FarmerService } from './farmer.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';

import { HashingServiceProtocol } from '../auth/hash/hashing.service';
import { FarmerFactory } from 'src/mocks/factories/farmer.factory';

describe('FarmerService', () => {
  let service: FarmerService;
  let prismaService: PrismaService;
  let hashingService: HashingServiceProtocol;

  const mockPrismaService = {
    farmer: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

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
    prismaService = module.get<PrismaService>(PrismaService);
    hashingService = module.get<HashingServiceProtocol>(HashingServiceProtocol);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a farmer successfully', async () => {
      const farmerData = FarmerFactory.createWithValidCPF();
      const hashedPassword = 'hashedPassword123';
      const expectedFarmer = {
        id: 1,
        name: farmerData.name,
        email: farmerData.email
      };

      mockPrismaService.farmer.findUnique
        .mockResolvedValueOnce(null) // document check
        .mockResolvedValueOnce(null); // email check
      mockHashingService.hash.mockResolvedValue(hashedPassword);
      mockPrismaService.farmer.create.mockResolvedValue(expectedFarmer);

      const result = await service.create(farmerData);

      expect(mockPrismaService.farmer.findUnique).toHaveBeenCalledTimes(2);
      expect(mockHashingService.hash).toHaveBeenCalledWith(farmerData.password);
      expect(mockPrismaService.farmer.create).toHaveBeenCalledWith({
        data: {
          name: farmerData.name,
          document: farmerData.document,
          email: farmerData.email,
          password: hashedPassword
        },
        select: {
          id: true,
          name: true,
          email: true,
        }
      });
      expect(result).toEqual(expectedFarmer);
    });

    it('should create multiple farmers with different document types', async () => {
      const cpfFarmer = FarmerFactory.createWithValidCPF();
      const cnpjFarmer = FarmerFactory.createWithValidCNPJ();

      mockPrismaService.farmer.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      mockHashingService.hash.mockResolvedValue('hashedPassword');
      mockPrismaService.farmer.create
        .mockResolvedValueOnce({ id: 1, name: cpfFarmer.name, email: cpfFarmer.email })
        .mockResolvedValueOnce({ id: 2, name: cnpjFarmer.name, email: cnpjFarmer.email });

      const result1 = await service.create(cpfFarmer);
      const result2 = await service.create(cnpjFarmer);

      expect(result1.name).toBe(cpfFarmer.name);
      expect(result2.name).toBe(cnpjFarmer.name);
    });
  });

  describe('findAllPaginated', () => {
    it('should return paginated farmers', async () => {
      const farmers = FarmerFactory.createMany(5).map((farmer, index) => ({
        id: index + 1,
        name: farmer.name,
        email: farmer.email,
        role: 'farmer',
        Farm: []
      }));

      mockPrismaService.farmer.findMany.mockResolvedValue(farmers);
      mockPrismaService.farmer.count.mockResolvedValue(5);

      const result = await service.findAllPaginated({ page: 1, limit: 10 });

      expect(mockPrismaService.farmer.findMany).toHaveBeenCalled();
      expect(mockPrismaService.farmer.count).toHaveBeenCalled();
      expect(result.data).toHaveLength(5);
      expect(result.meta.total).toBe(5);
    });

    it('should handle empty results', async () => {
      mockPrismaService.farmer.findMany.mockResolvedValue([]);
      mockPrismaService.farmer.count.mockResolvedValue(0);

      const result = await service.findAllPaginated({ page: 1, limit: 10 });

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should find a farmer by id', async () => {
      const farmer = FarmerFactory.createWithValidCPF();
      const expectedFarmer = {
        id: 1,
        name: farmer.name,
        email: farmer.email,
        role: 'farmer',
        Farm: []
      };

      mockPrismaService.farmer.findFirst.mockResolvedValue(expectedFarmer);

      const result = await service.findOne(1);

      expect(mockPrismaService.farmer.findFirst).toHaveBeenCalledWith({
        where: { id: 1 },
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
      expect(result).toEqual(expectedFarmer);
    });
  });

  describe('updateById', () => {
    it('should update a farmer successfully', async () => {
      const updateData = { name: 'Updated Name' };
      const existingFarmer = FarmerFactory.createWithValidCPF();
      const farmerWithId = {
        id: 1,
        name: existingFarmer.name,
        email: existingFarmer.email,
        role: 'farmer',
        Farm: []
      };
      const updatedFarmer = {
        id: 1,
        name: 'Updated Name',
        email: existingFarmer.email
      };

      mockPrismaService.farmer.findFirst.mockResolvedValue(farmerWithId);
      mockPrismaService.farmer.update.mockResolvedValue(updatedFarmer);

      const result = await service.updateById(1, updateData);

      expect(mockPrismaService.farmer.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: 'Updated Name',
          email: existingFarmer.email
        },
        select: {
          id: true,
          name: true,
          email: true,
        }
      });
      expect(result).toEqual(updatedFarmer);
    });
  });

  describe('deleteById', () => {
    it('should delete a farmer successfully', async () => {
      const farmer = FarmerFactory.createWithValidCPF();
      const farmerWithId = {
        id: 1,
        name: farmer.name,
        email: farmer.email,
        role: 'farmer',
        Farm: []
      };

      mockPrismaService.farmer.findFirst.mockResolvedValue(farmerWithId);
      mockPrismaService.farmer.delete.mockResolvedValue(farmerWithId);

      const result = await service.deleteById(1);

      expect(mockPrismaService.farmer.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual({ statusCode: 200, message: 'Operação realizada com sucesso.' });
    });
  });

  describe('findAll', () => {
    it('should return all farmers', async () => {
      const farmers = FarmerFactory.createMany(3).map((farmer, index) => ({
        id: index + 1,
        name: farmer.name,
        email: farmer.email,
        Farm: []
      }));

      mockPrismaService.farmer.findMany.mockResolvedValue(farmers);

      const result = await service.findAll();

      expect(mockPrismaService.farmer.findMany).toHaveBeenCalledWith({
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
      expect(result).toEqual(farmers);
    });
  });
}); 