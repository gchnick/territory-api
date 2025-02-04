import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Test, TestingModule } from "@nestjs/testing";
import * as nock from "nock";

import { baseTestModuleImports } from "@/tests/e2e/app/helpers/base-test-module-imports";
import { saveInitialTerritories } from "@/tests/e2e/app/overseer/territories/helpers";
import { CongregationMother } from "@/tests/unit/src/contexts/Overseer/congregation/domain/congregation-mother";
import { TerritoryMother } from "@/tests/unit/src/contexts/Overseer/territories/domain/territory-mother";

import { CongregationModule } from "@/app/overseer/congregations/congregation.module";
import { TerritoryModule } from "@/app/overseer/territories/territory.module";

import { Congregation } from "@/contexts/Overseer/congregations/domain/congregation";
import { CongregationRepository } from "@/contexts/Overseer/congregations/domain/congregation-repository";
import { Territory } from "@/contexts/Overseer/territories/domain/territory";
import { TerritoryRepository } from "@/contexts/Overseer/territories/domain/territory-repository";

describe("TerritoryGetController (e2e)", () => {
  const LENGHT_INITIAL_TERRITORY = 20;
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
    nock.enableNetConnect();
  });

  describe("/v1/api/territories (GET)", () => {
    let congregation: Congregation;
    let territories: Array<Territory>;
    beforeEach(async () => {
      await congregationRepo.deleteAll();
      await territoryRepo.deleteAll();
      congregation = CongregationMother.create();
      territories = TerritoryMother.createSuccession(
        LENGHT_INITIAL_TERRITORY,
        congregation.number.value,
      );
      await congregationRepo.save(congregation);
      await saveInitialTerritories(territoryRepo, territories);
    });

    it("should fetch all territories", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/territories",
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toMatch(/application\/json/);
      expect(response.payload).not.toBeFalsy();
    });

    it("should find territory by number and congregation", async () => {
      const congregationNumber = congregation.number.value;
      const numberParam = 10;
      const expectedLabel = territories[numberParam - 1].label.value;

      const response = await app.inject({
        method: "GET",
        url: `/territories/${congregationNumber}/${numberParam}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toMatch(/application\/json/);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(JSON.parse(response.payload).data.label).toBe(expectedLabel);
    });

    it("should fetch all territories be not assigned", async () => {
      const congregationNumber = congregation.number.value;
      const available = territories.filter(f => !f.currentAssigned.value);
      const expectedLength = available.length;

      const response = await app.inject({
        method: "GET",
        url:
          "/territories?" +
          `filters[0][field]=congregation&filters[0][operator]=EQUAL&filters[0][value]=${congregationNumber}` +
          "filters[1][field]=isAssigned&filters[1][operator]=EQUAL&filters[1][value]=false" +
          "&orderBy=lastCompleted&order=ASC",
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toMatch(/application\/json/);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(JSON.parse(response.payload).data).toHaveLength(expectedLength);
    });
  });
});
