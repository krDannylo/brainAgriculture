import { CreateFarmerDto } from "../module/farmer/dto/create-farmer.dto";
import { UpdateFarmerDto } from "../module/farmer/dto/update-farmer.dto";

export const mockCreateFarmerDto: CreateFarmerDto = {
  name: 'Test Farmer',
  document: '12345678901',
  email: 'email@email.com',
  password: '123123123'
};

export const mockFarmer = {
  id: 1,
  name: 'Test Farmer',
  document: '12345678901',
  email: 'email@email.com',
  createdAt: new Date(),
  updatedAt: new Date(),
  Farm: [],
};

export const mockFarmers = [
  {
    id: 1,
    name: 'Test Farmer 1',
    document: '12345678901',
    email: 'test1@email.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    Farm: [],
  },
  {
    id: 2,
    name: 'Test Farmer 2',
    document: '98765432109',
    email: 'test2@email.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    Farm: [],
  },
];

export const mockUpdateFarmerDto: UpdateFarmerDto = {
  name: 'Updated Farmer',
};

export const mockUpdatedFarmer = {
  id: 1,
  name: 'Updated Farmer',
  document: '12345678901',
  email: 'email@email.com',
  createdAt: new Date(),
  updatedAt: new Date(),
  Farm: [],
};

export const mockPrismaService = {
  farmer: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

export const mockFarmerService = {
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  updateById: jest.fn(),
  deleteById: jest.fn(),
}; 