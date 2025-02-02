import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Test, TestingModule } from "@nestjs/testing";

import { UserEmailMother } from "@/tests/unit/src/contexts/shared/users/domain/user-email-mother";
import { UserIdMother } from "@/tests/unit/src/contexts/shared/users/domain/user-id-mother";
import { UserPasswordMother } from "@/tests/unit/src/contexts/shared/users/domain/user-password-mother";

import { UserModule } from "@/app/shared/user/user.module";

import { User } from "@/contexts/shared/users/domain/user";
import { UserRepository } from "@/contexts/shared/users/domain/user-repository";

import { CommandModule } from "@/core/command-bus/command.module";
import { EventBusModule } from "@/core/event-bus/event-bus.module";
import { LoggerModule } from "@/core/logger/logger.module";
import { QueryModule } from "@/core/query-bus/query.module";
import { SharedModule } from "@/core/shared/shared.module";

import { SignupPostRequestMother } from "../../auth/requests/signup-post-request-mother";
import {
  createAllRoles,
  createUsers,
  saveInitialRoles,
  saveInitialUsers,
} from "../helper";

describe("UserPutController (e2e)", () => {
  const roles = createAllRoles();
  let app: NestFastifyApplication;
  let repo: UserRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
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
    repo = app.get(UserRepository);
    await saveInitialRoles(repo, roles);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("/v1/api/users (PUT)", () => {
    let users: Array<User>;
    beforeEach(async () => {
      await repo.deleteAll();
      users = createUsers(roles);
      await saveInitialUsers(repo, users);
    });

    it("should create a new user if not already registry", async () => {
      const id = UserIdMother.create();
      const request = SignupPostRequestMother.create({
        roles: ["SERVICE_OVERSSER"],
      });

      const response = await app.inject({
        method: "PUT",
        url: `/${id.value}`,
        payload: request,
      });

      expect(response.statusCode).toBe(201);
      expect(response.headers["Location"]).not.toBeNull();
    });

    it("should update user with id already registry", async () => {
      const id = users[0].id.value;
      const request = {
        email: UserEmailMother.create().value,
        password: UserPasswordMother.create().value,
      };

      const response = await app.inject({
        method: "PUT",
        url: `/${id}`,
        payload: request,
      });

      expect(response.statusCode).toBe(200);
    });
  });
});
