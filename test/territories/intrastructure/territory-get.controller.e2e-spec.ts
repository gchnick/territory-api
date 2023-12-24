import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TerritoryRepository } from '@territories/domain/territory-repository';
import { TerritoryModule } from '@territories/infrastructure/dependencies/nest/territory.module';
import * as request from 'supertest';
import { saveInitialTerritories } from './helpers';
import { TerritoryMother } from './territory-controller.mother';

describe('TerritoryGetController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TerritoryModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const repo = app.get(TerritoryRepository);
    await repo.deleteAll();
    await saveInitialTerritories(repo, TerritoryMother.INITIAL_TERRITORIES);
  });

  describe('/v1/api/territories (GET)', () => {
    it('should fetch all territories', () => {
      const expectedCode = 200;
      return request(app.getHttpServer())
        .get('')
        .expect('Content-Type', /json/)
        .expect(expectedCode);
    });
  });

  describe('/v1/api/territories/3 (GET)', () => {
    it('should find territory by number', () => {
      const expectedCode = 200;
      const numberParam = 3;
      return request(app.getHttpServer())
        .get(`/${numberParam}`)
        .expect(expectedCode);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
