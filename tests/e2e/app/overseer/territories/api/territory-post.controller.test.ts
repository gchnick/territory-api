import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Test, TestingModule } from "@nestjs/testing";
import * as nock from "nock";

import { baseTestModuleImports } from "@/tests/e2e/app/helpers/base-test-module-imports";
import { prepareTerritoriesInDB } from "@/tests/e2e/app/overseer/territories/helpers";

import { CongregationModule } from "@/app/overseer/congregations/congregation.module";
import { TerritoryModule } from "@/app/overseer/territories/territory.module";

import { Congregation } from "@/contexts/Overseer/congregations/domain/congregation";
import { CongregationRepository } from "@/contexts/Overseer/congregations/domain/congregation-repository";
import { TerritoryRepository } from "@/contexts/Overseer/territories/domain/territory-repository";

import { TerritoryPostRequestMother } from "../requests/territory-post-request-mother";

describe("TerritoryPostController (e2e)", () => {
  let app: NestFastifyApplication;
  let congregationRepo: CongregationRepository;
  let territoryRepo: TerritoryRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ...baseTestModuleImports(),
        CongregationModule,
        TerritoryModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    congregationRepo = app.get(CongregationRepository);
    territoryRepo = app.get(TerritoryRepository);
    nock.disableNetConnect();
    nock.enableNetConnect("127.0.0.1");
  });

  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("/v1/api/territories (POST)", () => {
    let congregation: Congregation;
    beforeEach(async () => {
      const result = await prepareTerritoriesInDB(
        congregationRepo,
        territoryRepo,
      );
      congregation = result.congregation;
    });

    it("should create a new territory", async () => {
      const requestTerritory = TerritoryPostRequestMother.create({
        number: 21,
        congregationId: congregation.number.value,
      });

      const response = await app.inject({
        method: "POST",
        url: "/territories",
        body: requestTerritory,
      });

      expect(response.statusCode).toBe(201);
      expect(response.headers["Location"]).not.toBeNull();
    });

    it("should send 400 status code when terriory number already registry in congragation", async () => {
      const requestTerritory = TerritoryPostRequestMother.create({
        number: 2,
        congregationId: congregation.number.value,
      });

      const response = await app.inject({
        method: "POST",
        url: "/territories",
        body: requestTerritory,
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
