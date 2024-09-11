import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as nock from "nock";

import { TYPE_ORM_ENTITIES } from "@/tests/e2e/app/helpers/constants";
import { saveInitialTerritories } from "@/tests/e2e/app/overseer/territories/helpers";
import { TerritoryMother } from "@/tests/unit/src/context/Overseer/territories/domain/territory-mother";

import { TerritoryModule } from "@/app/overseer/territories/territory.module";

import { Territory } from "@/contexts/Overseer/territories/domain/territory";
import { TerritoryRepository } from "@/contexts/Overseer/territories/domain/territory-repository";

import { CommandModule } from "@/core/command-bus/command.module";
import typeOrmOptions from "@/core/config/typeorm/type-orm-options";
import { EventBusModule } from "@/core/event-bus/event-bus.module";
import { LoggerModule } from "@/core/logger/logger.module";
import { QueryModule } from "@/core/query-bus/query.module";
import { SharedModule } from "@/core/shared/shared.module";

describe("TerritoryGetController (e2e)", () => {
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
        TypeOrmModule.forRootAsync(typeOrmOptions(TYPE_ORM_ENTITIES)),
      ],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    repo = app.get(TerritoryRepository);
    nock.disableNetConnect();
    nock.enableNetConnect("127.0.0.1");
  });

  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("/v1/api/territories (GET)", () => {
    let territories: Array<Territory>;
    beforeEach(async () => {
      await repo.deleteAll();
      territories = TerritoryMother.createSuccession(LENGHT_INITIAL_TERRITORY);
      await saveInitialTerritories(repo, territories);
    });

    it("should fetch all territories", async () => {
      const response = await app.inject({ method: "GET", url: "/" });

      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toMatch(/application\/json/);
      expect(response.payload).not.toBeFalsy();
    });

    it("should find territory by number", async () => {
      const numberParam = 10;
      const expectedLabel = territories[numberParam - 1].label.value;

      const response = await app.inject({
        method: "GET",
        url: `/${numberParam}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toMatch(/application\/json/);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(JSON.parse(response.payload).data.label).toBe(expectedLabel);
    });

    it("should fetch all territories be not locked", async () => {
      const available = territories.filter(f => !f.isLocked.value);
      const expectedLength = available.length;

      const response = await app.inject({
        method: "GET",
        url: "/?filters[0][field]=isLocked&filters[0][operator]=EQUAL&filters[0][value]=false&orderBy=lastDateCompleted&order=ASC",
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toMatch(/application\/json/);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(JSON.parse(response.payload).data).toHaveLength(expectedLength);
    });
  });
});
