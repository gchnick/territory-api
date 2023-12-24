import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TerritoryRepository } from '@territories/domain/territory-repository';
import { TerritoryModule } from '@territories/infrastructure/dependencies/nest/territory.module';
import * as request from 'supertest';
import { saveInitialTerritories } from './helpers';
import { TerritoryMother } from './territory.mother';

describe('TerritoryPostController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TerritoryModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const repo = app.get(TerritoryRepository);
    await repo.deleteAll();
    await saveInitialTerritories(repo, TerritoryMother.INITIAL_TERRITORIES);
  });

  it('/v1/api/territories (POST)', () => {
    const territoryMocked = TerritoryMother.REQUEST_TERRITORY_4;
    return request(app.getHttpServer())
      .post('')
      .send(territoryMocked)
      .expect('Location', `/v1/api/territories/${territoryMocked.id}`)
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
