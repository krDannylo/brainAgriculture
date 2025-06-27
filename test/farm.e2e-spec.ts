import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../src/module/app/app.module';

describe('FarmController (e2e)', () => {
  let app: INestApplication;

  const farmerData = {
    name: 'Maria Fazenda',
    document: '98765432100',
    email: 'maria.fazenda@example.com',
    password: 'senhaFazenda123'
  };

  const farmData = {
    name: 'Fazenda Teste',
    city: 'Cidade Teste',
    state: 'SP',
    totalArea: 100,
    arableArea: 60,
    vegetationArea: 40,
    areaControl: true
  };

  let accessToken: string;
  let createdFarmId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/farms (GET) - deve exigir autenticação', async () => {
    await supertest(app.getHttpServer())
      .get('/farms')
      .expect(401);
  });
}); 