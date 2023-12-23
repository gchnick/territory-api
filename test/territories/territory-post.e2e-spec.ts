import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TerritoryModule } from '@territories/infrastructure/dependencies/nest/territory.module';
import * as request from 'supertest';
import { TerritoryMother } from './territory.mother';

describe('TerritoryPostController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TerritoryModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/v1/api/territories (POST)', () => {
    const territoryRequest = TerritoryMother.territoryRequest();
    return request(app.getHttpServer())
      .post('/v1/api/territories')
      .send(territoryRequest)
      .expect('Location', `/v1/api/territories/${territoryRequest.id}`)
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
