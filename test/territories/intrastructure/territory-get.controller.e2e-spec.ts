import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TerritoryRepository } from '@territories/domain/territory-repository';
import { TerritoryModule } from '@territories/infrastructure/dependencies/nest/territory.module';
import * as request from 'supertest';
import { TerritoryMother } from '../domain/territory.mother';
import { saveInitialTerritories } from './helpers';

describe('TerritoryGetController (e2e)', () => {
  const LENGHT_INITIAL_TERRITORY = 20;
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
      await saveInitialTerritories(
        repo,
        TerritoryMother.createInicialTerritories(LENGHT_INITIAL_TERRITORY),
      );
    });

    it('should fetch all territories', async () => {
      const expectedCode = 200;
      return request(app.getHttpServer())
        .get('')
        .expect(expectedCode)
        .expect('Content-Type', /application\/json/)
        .then((result) => {
          expect(result.body).toHaveProperty('data');
          expect(result.body.data).toHaveLength(LENGHT_INITIAL_TERRITORY);
        });
    });

    it('should find territory by number', async () => {
      const expectedCode = 200;
      const numberParam = 10;
      return request(app.getHttpServer())
        .get(`/${numberParam}`)
        .expect(expectedCode)
        .expect('Content-Type', /application\/json/)
        .then((result) => {
          expect(result.body).toHaveProperty('data');
          expect(result.body.data.number).toBe(numberParam);
        });
    });

    it('should fetch all territories be not locked', async () => {
      const expectedCode = 200;
      const queryParam = 'isLocked';
      const queryValue = false;
      const filters = `filters={field:'${queryParam}',operator:'=',value:'${queryValue}'}`;
      return request(app.getHttpServer())
        .get(`/?${filters}`)
        .expect(expectedCode)
        .expect('Content-Type', /application\/json/)
        .then((result) => {
          expect(result.body).toHaveProperty('data');
          expect(result.body.data[0].isLocked).toBe(false);
          expect(result.body.data[1].isLocked).toBe(false);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
