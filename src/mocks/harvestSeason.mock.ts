import { CreateHarvestSeasonDto } from "../module/harvestSeason/dto/create-harvest-season.dto";
import { UpdateHarvestSeasonDto } from "../module/harvestSeason/dto/update-harvest-season.dto";

export const mockCreateHarvestSeasonDto: CreateHarvestSeasonDto = {
  year: '2024',
  farmId: 1,
};

export const mockHarvestSeason = {
  id: 1,
  year: '2024',
  farmId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockHarvestSeasons = [
  {
    id: 1,
    year: '2024',
    farmId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    year: '2025',
    farmId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockUpdateHarvestSeasonDto: UpdateHarvestSeasonDto = {
  year: '2025',
  farmId: 2,
};

export const mockUpdatedHarvestSeason = {
  ...mockHarvestSeason,
  ...mockUpdateHarvestSeasonDto,
};

export const mockPrismaService = {
  harvestSeason: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  farm: {
    findUnique: jest.fn(),
  },
};

export const mockHarvestSeasonService = {
  createOne: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
}; 