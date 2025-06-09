import { CreateFarmDto } from "../module/farm/dto/create-farm.dto";
import { UpdateFarmDto } from "../module/farm/dto/update-farm.dto";

export const mockCreateFarmDto: CreateFarmDto = {
  name: 'Test Farm',
  city: 'Test City',
  state: 'SP',
  totalArea: 1000,
  arableArea: 600,
  vegetationArea: 400,
  farmerId: 1,
  areaControl: true,
};

export const mockFarm = {
  id: 1,
  ...mockCreateFarmDto,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockFarms = [
  {
    id: 1,
    name: 'Test Farm 1',
    city: 'Test City',
    state: 'SP',
    totalArea: 1000,
    arableArea: 600,
    vegetationArea: 400,
    farmerId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Test Farm 2',
    city: 'Test City',
    state: 'SP',
    totalArea: 2000,
    arableArea: 1200,
    vegetationArea: 800,
    farmerId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockUpdateFarmDto: UpdateFarmDto = {
  name: 'Updated Farm',
  areaVerify: true,
};

export const mockUpdatedFarm = {
  id: 1,
  name: 'Updated Farm',
  city: 'Test City',
  state: 'SP',
  totalArea: 1000,
  arableArea: 600,
  vegetationArea: 400,
  farmerId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockPrismaService = {
  farm: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  farmer: {
    findUnique: jest.fn(),
  },
};

export const mockFarmService = {
  createOne: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
}; 