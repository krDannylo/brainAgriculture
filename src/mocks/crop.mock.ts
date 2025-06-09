import { CreateCropDto } from "../module/crop/dto/create-crop.dto";
import { UpdateCropDto } from "../module/crop/dto/update-crop.dto";

export const mockCreateCropDto: CreateCropDto = {
  name: 'Test Crop',
  harvestSeasonId: 1,
};

export const mockCrop = {
  id: 1,
  ...mockCreateCropDto,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCrops = [
  {
    id: 1,
    name: 'Test Crop 1',
    harvestSeasonId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Test Crop 2',
    harvestSeasonId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockUpdateCropDto: UpdateCropDto = {
  name: 'Updated Crop',
  harvestSeasonId: 2,
};

export const mockUpdatedCrop = {
  id: 1,
  name: 'Updated Crop',
  harvestSeasonId: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockPrismaService = {
  crop: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  harvestSeason: {
    findUnique: jest.fn(),
  },
};

export const mockCropService = {
  createOne: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
}; 