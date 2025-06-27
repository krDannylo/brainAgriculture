import { Test, TestingModule } from '@nestjs/testing';
import { FarmController } from './farm.controller';
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { AuthTokenGuard } from '../auth/guard/auth-token.guard';
import { ApplyUserIdInterceptor } from 'src/common/interceptors/apply-id.interceptor';
import { PayloadTokenDto } from '../auth/dto/payload-token.dto';

const mockFarmService = {
  createOne: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
  findAllByFarmer: jest.fn(),
  findOneByFarmer: jest.fn(),
  updateOneByFarmer: jest.fn(),
  deleteOneByFarmer: jest.fn(),
};

describe('FarmController', () => {
  let controller: FarmController;
  let service: typeof mockFarmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmController],
      providers: [
        { provide: FarmService, useValue: mockFarmService },
      ],
    })
      .overrideGuard(AuthTokenGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideInterceptor(ApplyUserIdInterceptor)
      .useValue({ intercept: jest.fn((_, next) => next.handle()) })
      .compile();

    controller = module.get<FarmController>(FarmController);
    service = module.get(FarmService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createFarm', () => {
    it('should call createOne', async () => {
      const dto = {} as CreateFarmDto;
      await controller.createFarm(dto);
      expect(service.createOne).toHaveBeenCalledWith(dto);
    });
  });

  describe('findFarmById', () => {
    it('should call findOne for admin', async () => {
      const payload = { role: 'admin' } as PayloadTokenDto;
      await controller.findFarmById(payload, 1);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
    it('should call findOneByFarmer for farmer', async () => {
      const payload = { role: 'farmer', sub: 2 } as PayloadTokenDto;
      await controller.findFarmById(payload, 2);
      expect(service.findOneByFarmer).toHaveBeenCalledWith(2, 2);
    });
  });

  describe('findFarms', () => {
    it('should call findAll for admin', async () => {
      const payload = { role: 'admin' } as PayloadTokenDto;
      await controller.findFarms(payload);
      expect(service.findAll).toHaveBeenCalled();
    });
    it('should call findAllByFarmer for farmer', async () => {
      const payload = { role: 'farmer', sub: 3 } as PayloadTokenDto;
      await controller.findFarms(payload);
      expect(service.findAllByFarmer).toHaveBeenCalledWith(3);
    });
  });

  describe('updateFarmById', () => {
    it('should call updateOne for admin', async () => {
      const payload = { role: 'admin' } as PayloadTokenDto;
      const dto = {} as UpdateFarmDto;
      await controller.updateFarmById(payload, 1, dto);
      expect(service.updateOne).toHaveBeenCalledWith(1, dto);
    });
    it('should call updateOneByFarmer for farmer', async () => {
      const payload = { role: 'farmer', sub: 4 } as PayloadTokenDto;
      const dto = {} as UpdateFarmDto;
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