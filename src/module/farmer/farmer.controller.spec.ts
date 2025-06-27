import { Test, TestingModule } from '@nestjs/testing';
import { FarmerController } from './farmer.controller';
import { FarmerService } from './farmer.service';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { AuthTokenGuard } from '../auth/guard/auth-token.guard';
import { PayloadTokenDto } from '../auth/dto/payload-token.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

const mockFarmerService = {
  create: jest.fn(),
  findOne: jest.fn(),
  findAllPaginated: jest.fn(),
  updateById: jest.fn(),
  deleteById: jest.fn(),
};

describe('FarmerController', () => {
  let controller: FarmerController;
  let service: typeof mockFarmerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmerController],
      providers: [
        { provide: FarmerService, useValue: mockFarmerService },
      ],
    })
      .overrideGuard(AuthTokenGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<FarmerController>(FarmerController);
    service = module.get(FarmerService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createFarmer', () => {
    it('should call create', async () => {
      const dto = {} as CreateFarmerDto;
      await controller.createFarmer(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findFarmerById', () => {
    it('should call findOne', async () => {
      await controller.findFarmerById(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('findFarmers', () => {
    it('should call findAllPaginated', async () => {
      const paginationQuery = { page: 1, limit: 10 } as PaginationQueryDto;
      await controller.findFarmers(paginationQuery);
      expect(service.findAllPaginated).toHaveBeenCalledWith(paginationQuery);
    });
  });

  describe('updateFarmer', () => {
    it('should call updateById', async () => {
      const dto = {} as UpdateFarmerDto;
      await controller.updateFarmer(1, dto);
      expect(service.updateById).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('deleteFarmerById', () => {
    it('should call deleteById', async () => {
      await controller.deleteFarmerById(1);
      expect(service.deleteById).toHaveBeenCalledWith(1);
    });
  });
}); 