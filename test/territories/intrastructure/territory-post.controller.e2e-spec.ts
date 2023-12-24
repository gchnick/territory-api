import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TerritoryRepository } from '@territories/domain/territory-repository';
import { TerritoryMother } from '@territories/domain/test/territory.mother';
import { TerritoryModule } from '@territories/infrastructure/dependencies/nest/territory.module';
import * as request from 'supertest';
import { saveInitialTerritories } from './helpers';
import { TerritoryControllerMother } from './territory-controller.mother';

describe('TerritoryPostController (e2e)', () => {
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

  describe('/v1/api/territories (POST)', () => {
    it('should create new territory', () => {
      const territoryMocked = TerritoryControllerMother.REQUEST_TERRITORY_4;
      return request(app.getHttpServer())
        .post('')
        .send(territoryMocked)
        .expect('Location', `/v1/api/territories/${territoryMocked.id}`)
        .expect(201);
    });

    it('when terriory number already registry should send 400 status code', () => {
      const territoryMocked =
        TerritoryMother.INITIAL_TERRITORIES[0].toPrimitives();
      const expectedCode = 400;
      return request(app.getHttpServer())
        .post('')
        .send(territoryMocked)
        .expect(expectedCode);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
