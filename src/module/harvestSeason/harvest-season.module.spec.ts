import { Test, TestingModule } from '@nestjs/testing';
import { HarvestSeasonModule } from './harvest-season.module';
import { AuthTokenGuard } from '../auth/guard/auth-token.guard';

describe('HarvestSeasonModule', () => {
  let module: HarvestSeasonModule;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [HarvestSeasonModule],
    })
      .overrideGuard(AuthTokenGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();
    module = testingModule.get<HarvestSeasonModule>(HarvestSeasonModule);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
}); 