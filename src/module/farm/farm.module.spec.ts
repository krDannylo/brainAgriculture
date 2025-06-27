import { Test, TestingModule } from '@nestjs/testing';
import { FarmModule } from './farm.module';
import { AuthTokenGuard } from '../auth/guard/auth-token.guard';

describe('FarmModule', () => {
  let module: FarmModule;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [FarmModule],
    })
      .overrideGuard(AuthTokenGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();
    module = testingModule.get<FarmModule>(FarmModule);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
}); 