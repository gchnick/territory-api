import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";

import { TerritoryModule } from "@app/territories/territory.module";

import { TerritoryRepository } from "@contexts/registry/territories/domain/territory-repository";

import { TerritoryMother } from "../../../../unit/src/context/registry/territories/domain/territory.mother";
import { saveInitialTerritories } from "../helpers";
import { TerritoryPostRequestMother } from "./requests/territory-post-request-mother";

describe("TerritoryPostController (e2e)", () => {
  const LENGHT_INITIAL_TERRITORY = 20;
  const URL_BASE = "/v1/api/territories";
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

  describe("/v1/api/territories (POST)", () => {
    beforeEach(async () => {
      await repo.deleteAll();
      await saveInitialTerritories(
        repo,
        TerritoryMother.createSuccession(LENGHT_INITIAL_TERRITORY),
      );
    });

    it("should create new territory", () => {
      const requestTerritory = TerritoryPostRequestMother.create({
        number: 21,
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .post("")
        .send(requestTerritory)
        .expect("Location", `${URL_BASE}/${requestTerritory.id}`)
        .expect(201);
    });

    it("when terriory number already registry should send 400 status code", () => {
      const requestTerritory = TerritoryPostRequestMother.create({
        number: 5,
      });
      const expectedCode = 400;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .post("")
        .send(requestTerritory)
        .expect(expectedCode);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
