import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Test, TestingModule } from "@nestjs/testing";
import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import nock from "nock";

import { AuthModule } from "@/app/auth/auth.module";
import { UserModule } from "@/app/user/user.module";

import { CommandModule } from "@/core/command-bus/command.module";
import { EventBusModule } from "@/core/event-bus/event-bus.module";
import { LoggerModule } from "@/core/logger/logger.module";
import { QueryModule } from "@/core/query-bus/query.module";
import { SharedModule } from "@/core/shared/shared.module";

import { User } from "@/contexts/registry/users/domain/user";
import { UserRepository } from "@/contexts/registry/users/domain/user-repository";
import { RoleEntity } from "@/contexts/registry/users/infrastructure/persistence/typeorm/role-entity";
import { UserEntity } from "@/contexts/registry/users/infrastructure/persistence/typeorm/user-entity";

import { PostgresTestContainer } from "../../helpers/postgres-test-container";
import { TypeOrmPostgresTestingModule } from "../../helpers/typeorm-posgrest-testing-module";
import {
  createAllRoles,
  createUsers,
  saveInitialRoles,
  saveInitialUsers,
} from "../../users/helper";
import { AuthPostRequestMother } from "../requests/auth-post-request-mother";
import { SignupPostRequestMother } from "../requests/signup-post-request-mother";

describe("AuthPostController (e2e)", () => {
  const roles = createAllRoles();
  let app: NestFastifyApplication;
  let repo: UserRepository;
  let container: StartedPostgreSqlContainer;

  beforeAll(async () => {
    container = await PostgresTestContainer.container();
    const postgresUri = container.getConnectionUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        AuthModule,
        SharedModule,
        LoggerModule,
        CommandModule,
        QueryModule,
        EventBusModule,
        TypeOrmPostgresTestingModule([UserEntity, RoleEntity], postgresUri),
      ],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    nock.disableNetConnect();
    nock.enableNetConnect("127.0.0.1");
    repo = app.get(UserRepository);
    await saveInitialRoles(repo, roles);
  }, 60_000);

  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(async () => {
    await app.close();
    nock.enableNetConnect();
    await container.stop();
  }, 60_000);

  describe("/v1/api/auth/login (POST)", () => {
    let users: Array<User>;
    beforeEach(async () => {
      await repo.deleteAll();
      users = createUsers(roles);
      await saveInitialUsers(repo, users);
    });

    it("should generate token with valid credentials", async () => {
      const email = users[0].email.value;
      const password = users[0].password.value;

      const request = {
        email,
        password,
      };

      const response = await app.inject({
        method: "POST",
        url: "/login",
        payload: request,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("access_token");
    });

    it("should throw 401 with invalid credentials", async () => {
      const request = AuthPostRequestMother.create();

      const response = await app.inject({
        method: "POST",
        url: "/login",
        payload: request,
      });

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
    });

    it("should signup a new user", async () => {
      const request = SignupPostRequestMother.create({
        roles: ["SERVICE_OVERSSER"],
      });

      const response = await app.inject({
        method: "POST",
        url: "/signup",
        payload: request,
      });

      expect(response.statusCode).toBe(201);
      expect(response.headers["Location"]).not.toBeNull();
    });
  });
});
