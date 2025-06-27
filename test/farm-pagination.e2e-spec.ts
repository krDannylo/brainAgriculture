import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../src/module/app/app.module';

describe('Farm Pagination (e2e)', () => {
  let app: INestApplication;

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

  describe('/farms (GET) - Pagination', () => {
    it('should require authentication for paginated farms', async () => {
      await supertest(app.getHttpServer())
        .get('/farms')
        .expect(401);
    });

    it('should require authentication for paginated farms with custom parameters', async () => {
      await supertest(app.getHttpServer())
        .get('/farms?page=2&limit=5')
        .expect(401);
    });

    it('should require authentication for paginated farms with invalid parameters', async () => {
      await supertest(app.getHttpServer())
        .get('/farms?page=0&limit=0')
        .expect(401);
    });
  });
}); 