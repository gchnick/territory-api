import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";

import { TerritoryModule } from "@app/territories/territory.module";

import { TerritoryRepository } from "@contexts/registry/territories/domain/territory-repository";

import { TerritoryMother } from "../../../../unit/src/context/registry/territories/domain/territory.mother";
import { saveInitialTerritories } from "../helpers";

describe("TerritoryGetController (e2e)", () => {
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

  describe("/v1/api/territories (GET)", () => {
    beforeEach(async () => {
      await repo.deleteAll();
      await saveInitialTerritories(
        repo,
        TerritoryMother.createSuccession(LENGHT_INITIAL_TERRITORY),
      );
    });

    it("should fetch all territories", async () => {
      const expectedCode = 200;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .get("")
        .expect(expectedCode)
        .expect("Content-Type", /application\/json/)
        .then(result => {
          expect(result.body).toHaveProperty("data");
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(result.body.data).toHaveLength(LENGHT_INITIAL_TERRITORY);
        });
    });

    it("should find territory by number", async () => {
      const expectedCode = 200;
      const numberParam = 10;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .get(`/${numberParam}`)
        .expect(expectedCode)
        .expect("Content-Type", /application\/json/)
        .then(result => {
          expect(result.body).toHaveProperty("data");
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(result.body.data.number).toBe(numberParam);
        });
    });

    it("should fetch all territories be not locked", async () => {
      const expectedCode = 200;
      const queryParam = "isLocked";
      const queryValue = false;
      const filters = `filters={field:'${queryParam}',operator:'=',value:'${queryValue}'}`;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .get(`/?${filters}`)
        .expect(expectedCode)
        .expect("Content-Type", /application\/json/)
        .then(result => {
          expect(result.body).toHaveProperty("data");
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(result.body.data[0].isLocked).toBe(false);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(result.body.data[1].isLocked).toBe(false);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
