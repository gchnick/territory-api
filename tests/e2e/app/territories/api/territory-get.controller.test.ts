import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Test, TestingModule } from "@nestjs/testing";
import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import * as nock from "nock";

import { TerritoryModule } from "@/app/territories/territory.module";

import { CommandModule } from "@/core/command-bus/command.module";
import { EventBusModule } from "@/core/event-bus/event-bus.module";
import { LoggerModule } from "@/core/logger/logger.module";
import { QueryModule } from "@/core/query-bus/query.module";
import { SharedModule } from "@/core/shared/shared.module";

import { Territory } from "@/contexts/registry/territories/domain/territory";
import { TerritoryRepository } from "@/contexts/registry/territories/domain/territory-repository";
import { TerritoryEntity } from "@/contexts/registry/territories/infrastructure/persistence/typeorm/territory-entity";

import { TerritoryMother } from "../../../../unit/src/context/registry/territories/domain/territory-mother";
import { PostgresTestContainer } from "../../helpers/postgres-test-container";
import { TypeOrmPostgresTestingModule } from "../../helpers/typeorm-posgrest-testing-module";
import { saveInitialTerritories } from "../helpers";

describe("TerritoryGetController (e2e)", () => {
  const LENGHT_INITIAL_TERRITORY = 20;
  let app: NestFastifyApplication;
  let repo: TerritoryRepository;
  let container: StartedPostgreSqlContainer;

  beforeAll(async () => {
    container = await PostgresTestContainer.container();
    const postgresUri = container.getConnectionUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TerritoryModule,
        SharedModule,
        LoggerModule,
        CommandModule,
        QueryModule,
        EventBusModule,
        TypeOrmPostgresTestingModule([TerritoryEntity], postgresUri),
      ],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    nock.disableNetConnect();
    nock.enableNetConnect("127.0.0.1");
    repo = app.get(TerritoryRepository);
  }, 60_000);

  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(async () => {
    await app.close();
    nock.enableNetConnect();
    await container.stop();
  }, 60_000);

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
