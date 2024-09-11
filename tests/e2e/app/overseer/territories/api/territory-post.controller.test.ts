import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Test, TestingModule } from "@nestjs/testing";

import { TerritoryModule } from "@/app/overseer/territories/territory.module";

import { Territory } from "@/contexts/Overseer/territories/domain/territory";
import { TerritoryRepository } from "@/contexts/Overseer/territories/domain/territory-repository";

import { CommandModule } from "@/core/command-bus/command.module";
import { EventBusModule } from "@/core/event-bus/event-bus.module";
import { LoggerModule } from "@/core/logger/logger.module";
import { QueryModule } from "@/core/query-bus/query.module";
import { SharedModule } from "@/core/shared/shared.module";

import { TerritoryMother } from "../../../../../unit/src/context/Overseer/territories/domain/territory-mother";
import { saveInitialTerritories } from "../helpers";
import { TerritoryPostRequestMother } from "../requests/territory-post-request-mother";

describe("TerritoryPostController (e2e)", () => {
  const LENGHT_INITIAL_TERRITORY = 20;
  let app: NestFastifyApplication;
  let repo: TerritoryRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TerritoryModule,
        SharedModule,
        LoggerModule,
        CommandModule,
        QueryModule,
        EventBusModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    repo = app.get(TerritoryRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("/v1/api/territories (POST)", () => {
    let territories: Array<Territory>;
    beforeEach(async () => {
      await repo.deleteAll();
      territories = TerritoryMother.createSuccession(LENGHT_INITIAL_TERRITORY);
      await saveInitialTerritories(repo, territories);
    });

    it("should create a new territory", async () => {
      const requestTerritory = TerritoryPostRequestMother.create({
        number: 21,
      });

      const response = await app.inject({
        method: "POST",
        url: "/",
        body: requestTerritory,
      });

      expect(response.statusCode).toBe(201);
      expect(response.headers["Location"]).not.toBeNull();
    });

    it("should send 400 status code when terriory number already registry", async () => {
      const requestTerritory = TerritoryPostRequestMother.create({
        number: 5,
      });

      const response = await app.inject({
        method: "POST",
        url: "/",
        body: requestTerritory,
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
