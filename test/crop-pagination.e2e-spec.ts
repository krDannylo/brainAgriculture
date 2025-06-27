import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../src/module/app/app.module';

describe('Crop Pagination (e2e)', () => {
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

  describe('/crops (GET) - Pagination', () => {
    it('should require authentication for paginated crops', async () => {
      await supertest(app.getHttpServer())
        .get('/crops')
        .expect(401);
    });

    it('should require authentication for paginated crops with custom parameters', async () => {
      await supertest(app.getHttpServer())
        .get('/crops?page=1&limit=5')
        .expect(401);
    });

    it('should require authentication for paginated crops with invalid parameters', async () => {
      await supertest(app.getHttpServer())
        .get('/crops?page=0&limit=0')
        .expect(401);
    });
  });
}); 