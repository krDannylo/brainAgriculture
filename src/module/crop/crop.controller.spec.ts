import { Test, TestingModule } from '@nestjs/testing';
import { CropCrontroller } from './crop.controller';
import { CropService } from './crop.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { AuthTokenGuard } from '../auth/guard/auth-token.guard';
import { ApplyUserIdInterceptor } from 'src/common/interceptors/apply-id.interceptor';
import { PayloadTokenDto } from '../auth/dto/payload-token.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

const mockCropService = {
  createOne: jest.fn(),
  createOneByFarmer: jest.fn(),
  findOne: jest.fn(),
  findAllPaginated: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
  findAllByFarmerPaginated: jest.fn(),
  findOneByFarmer: jest.fn(),
  updateOneByFarmer: jest.fn(),
  deleteOneByFarmer: jest.fn(),
};

describe('CropCrontroller', () => {
  let controller: CropCrontroller;
  let service: typeof mockCropService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropCrontroller],
      providers: [
        { provide: CropService, useValue: mockCropService },
      ],
    })
      .overrideGuard(AuthTokenGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideInterceptor(ApplyUserIdInterceptor)
      .useValue({ intercept: jest.fn((_, next) => next.handle()) })
      .compile();

    controller = module.get<CropCrontroller>(CropCrontroller);
    service = module.get(CropService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCrop', () => {
    it('should call createOne for admin', async () => {
      const dto = {} as CreateCropDto;
      const payload = { role: 'admin' } as PayloadTokenDto;
      await controller.createCrop(payload, dto);
      expect(service.createOne).toHaveBeenCalledWith(dto);
    });
    it('should call createOneByFarmer for farmer', async () => {
      const dto = {} as CreateCropDto;
      const payload = { role: 'farmer', sub: 1 } as PayloadTokenDto;
      await controller.createCrop(payload, dto);
      expect(service.createOneByFarmer).toHaveBeenCalledWith(dto, 1);
    });
  });

  describe('findCropById', () => {
    it('should call findOne for admin', async () => {
      const payload = { role: 'admin' } as PayloadTokenDto;
      await controller.findCropById(payload, 1);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
    it('should call findOneByFarmer for farmer', async () => {
      const payload = { role: 'farmer', sub: 2 } as PayloadTokenDto;
      await controller.findCropById(payload, 2);
      expect(service.findOneByFarmer).toHaveBeenCalledWith(2, 2);
    });
  });

  describe('findCrops', () => {
    it('should call findAllPaginated for admin', async () => {
      const payload = { role: 'admin' } as PayloadTokenDto;
      const paginationQuery = { page: 1, limit: 10 } as PaginationQueryDto;
      await controller.findCrops(payload, paginationQuery);
      expect(service.findAllPaginated).toHaveBeenCalledWith(paginationQuery);
    });
    it('should call findAllByFarmerPaginated for farmer', async () => {
      const payload = { role: 'farmer', sub: 3 } as PayloadTokenDto;
      const paginationQuery = { page: 1, limit: 10 } as PaginationQueryDto;
      await controller.findCrops(payload, paginationQuery);
      expect(service.findAllByFarmerPaginated).toHaveBeenCalledWith(3, paginationQuery);
    });
  });

  describe('updateCropById', () => {
    it('should call updateOne for admin', async () => {
      const payload = { role: 'admin' } as PayloadTokenDto;
      const dto = {} as UpdateCropDto;
      await controller.updateCropById(payload, 1, dto);
      expect(service.updateOne).toHaveBeenCalledWith(1, dto);
    });
    it('should call updateOneByFarmer for farmer', async () => {
      const payload = { role: 'farmer', sub: 4 } as PayloadTokenDto;
      const dto = {} as UpdateCropDto;
      await controller.updateCropById(payload, 4, dto);
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