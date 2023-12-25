import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TerritoryRepository } from '@territories/domain/territory-repository';
import { TerritoryMother } from '@territories/domain/test/territory.mother';
import { TerritoryModule } from '@territories/infrastructure/dependencies/nest/territory.module';
import * as request from 'supertest';
import { saveInitialTerritories } from './helpers';

describe('TerritoryGetController (e2e)', () => {
  let app: INestApplication;
  let repo: TerritoryRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TerritoryModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    repo = app.get(TerritoryRepository);
  });

  describe('/v1/api/territories (GET)', () => {
    beforeEach(async () => {
      await repo.deleteAll();
      await saveInitialTerritories(repo, TerritoryMother.INITIAL_TERRITORIES);
    });

    it('should fetch all territories', async () => {
      const expectedCode = 200;
      const expectedLenght = 3;
      return request(app.getHttpServer())
        .get('')
        .expect(expectedCode)
        .expect('Content-Type', /application\/json/)
        .then((result) => {
          expect(result.body.data).toHaveLength(expectedLenght);
        });
    });

    it('should find territory by number', async () => {
      const expectedCode = 200;
      const numberParam = 3;
      const expectedLabel = TerritoryMother.INITIAL_TERRITORIES[2].label.value;
      return request(app.getHttpServer())
        .get(`/${numberParam}`)
        .expect(expectedCode)
        .expect('Content-Type', /application\/json/)
        .then((result) => {
          expect(result.body.data).not.toBeFalsy();
          expect(result.body.data.label).toBe(expectedLabel);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
