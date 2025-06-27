import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../src/module/app/app.module';

describe('SanitizePipe (e2e)', () => {
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

  describe('Sanitization Tests', () => {
    it('should require authentication for farm creation', async () => {
      const maliciousData = {
        name: '<script>alert("xss")</script>Fazenda Teste',
        city: '<img src="x" onerror="alert(1)">São Paulo',
        state: 'SP<b>malicious</b>'
      };

      await supertest(app.getHttpServer())
        .post('/farms')
        .send(maliciousData)
        .expect(401); // Authentication required
    });

    it('should require authentication for farm creation with nested data', async () => {
      const nestedData = {
        name: 'Test Farm',
        city: 'São Paulo<script>alert("xss")</script>',
        state: 'SP',
        totalArea: 1000,
        arableArea: 800,
        vegetationArea: 200,
        farmerId: 1
      };

      await supertest(app.getHttpServer())
        .post('/farms')
        .send(nestedData)
        .expect(401); // Authentication required
    });

    it('should require authentication for farm creation with array data', async () => {
      const arrayData = {
        name: 'Test Farm',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 1000,
        arableArea: 800,
        vegetationArea: 200,
        farmerId: 1,
        tags: ['<script>alert("xss")</script>tag1', 'tag2<img src="x">']
      };

      await supertest(app.getHttpServer())
        .post('/farms')
        .send(arrayData)
        .expect(401); // Authentication required
    });

    it('should require authentication for farm creation with valid data', async () => {
      const validData = {
        name: 'Fazenda Segura',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 1000,
        arableArea: 800,
        vegetationArea: 200,
        farmerId: 1
      };

      await supertest(app.getHttpServer())
        .post('/farms')
        .send(validData)
        .expect(401); // Authentication required
    });
  });
}); 