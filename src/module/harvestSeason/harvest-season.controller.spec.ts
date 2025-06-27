import { Test, TestingModule } from '@nestjs/testing';
import { HarvestSeasonController } from './harvest-season.controller';
import { HarvestSeasonService } from './harvest-season.service';
import { CreateHarvestSeasonDto } from './dto/create-harvest-season.dto';
import { UpdateHarvestSeasonDto } from './dto/update-harvest-season.dto';
import { PayloadTokenDto } from '../auth/dto/payload-token.dto';
import { AuthTokenGuard } from '../auth/guard/auth-token.guard';
import { ApplyUserIdInterceptor } from 'src/common/interceptors/apply-id.interceptor';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

const mockHarvestSeasonService = {
  createOne: jest.fn(),
  createOneByFarmer: jest.fn(),
  findOne: jest.fn(),
  findOneByFarmer: jest.fn(),
  findAllPaginated: jest.fn(),
  findAllByFarmerPaginated: jest.fn(),
  updateOne: jest.fn(),
  updateOneByFarmer: jest.fn(),
  deleteOne: jest.fn(),
  deleteOneByFarmer: jest.fn(),
};

describe('HarvestSeasonController', () => {
  let controller: HarvestSeasonController;
  let service: typeof mockHarvestSeasonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HarvestSeasonController],
      providers: [
        { provide: HarvestSeasonService, useValue: mockHarvestSeasonService },
      ],
    })
      .overrideGuard(AuthTokenGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideInterceptor(ApplyUserIdInterceptor)
      .useValue({ intercept: jest.fn((_, next) => next.handle()) })
      .compile();

    controller = module.get<HarvestSeasonController>(HarvestSeasonController);
    service = module.get(HarvestSeasonService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createHarvestSeason', () => {
    it('should call createOne for admin', async () => {
      const dto = {} as CreateHarvestSeasonDto;
      const payload = { role: 'admin' } as PayloadTokenDto;
      await controller.createHarvestSeason(payload, dto);
      expect(service.createOne).toHaveBeenCalledWith(dto);
    });
    it('should call createOneByFarmer for farmer', async () => {
      const dto = {} as CreateHarvestSeasonDto;
      const payload = { role: 'farmer', sub: 1 } as PayloadTokenDto;
      await controller.createHarvestSeason(payload, dto);
      expect(service.createOneByFarmer).toHaveBeenCalledWith(dto, 1);
    });
  });

  describe('findHarvestById', () => {
    it('should call findOne for admin', async () => {
      const payload = { role: 'admin' } as PayloadTokenDto;
      await controller.findHarvestById(payload, 1);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
    it('should call findOneByFarmer for farmer', async () => {
      const payload = { role: 'farmer', sub: 2 } as PayloadTokenDto;
      await controller.findHarvestById(payload, 2);
      expect(service.findOneByFarmer).toHaveBeenCalledWith(2, 2);
    });
  });

  describe('findHarvests', () => {
    it('should call findAllPaginated for admin', async () => {
      const payload = { role: 'admin' } as PayloadTokenDto;
      const paginationQuery = { page: 1, limit: 10 } as PaginationQueryDto;
      await controller.findHarvests(payload, paginationQuery);
      expect(service.findAllPaginated).toHaveBeenCalledWith(paginationQuery);
    });
    it('should call findAllByFarmerPaginated for farmer', async () => {
      const payload = { role: 'farmer', sub: 3 } as PayloadTokenDto;
      const paginationQuery = { page: 1, limit: 10 } as PaginationQueryDto;
      await controller.findHarvests(payload, paginationQuery);
      expect(service.findAllByFarmerPaginated).toHaveBeenCalledWith(3, paginationQuery);
    });
  });

  describe('updateFarmById', () => {
    it('should call updateOne for admin', async () => {
      const payload = { role: 'admin' } as PayloadTokenDto;
      const dto = {} as UpdateHarvestSeasonDto;
      await controller.updateFarmById(payload, 1, dto);
      expect(service.updateOne).toHaveBeenCalledWith(1, dto);
    });
    it('should call updateOneByFarmer for farmer', async () => {
      const payload = { role: 'farmer', sub: 4 } as PayloadTokenDto;
      const dto = {} as UpdateHarvestSeasonDto;
      await controller.updateFarmById(payload, 4, dto);
      expect(service.updateOneByFarmer).toHaveBeenCalledWith(4, 4, dto);
    });
  });

  describe('deleteFarmById', () => {
    it('should call deleteOne for admin', async () => {
      const payload = { role: 'admin' } as PayloadTokenDto;
      await controller.deleteFarmById(payload, 1);
      expect(service.deleteOne).toHaveBeenCalledWith(1);
    });
    it('should call deleteOneByFarmer for farmer', async () => {
      const payload = { role: 'farmer', sub: 5 } as PayloadTokenDto;
      await controller.deleteFarmById(payload, 5);
      expect(service.deleteOneByFarmer).toHaveBeenCalledWith(5, 5);
    });
  });
}); 