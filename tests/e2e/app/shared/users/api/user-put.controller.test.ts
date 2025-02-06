import { ConfigService } from "@nestjs/config";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Test, TestingModule } from "@nestjs/testing";
import * as nock from "nock";

import { baseTestModuleImports } from "@/tests/e2e/app/helpers/base-test-module-imports";
import { SignupPostRequestMother } from "@/tests/e2e/app/shared/auth/requests/signup-post-request-mother";
import { UserEmailMother } from "@/tests/unit/src/contexts/shared/users/domain/user-email-mother";
import { UserIdMother } from "@/tests/unit/src/contexts/shared/users/domain/user-id-mother";
import { UserPasswordMother } from "@/tests/unit/src/contexts/shared/users/domain/user-password-mother";

import { UserModule } from "@/app/shared/user/user.module";

import { Jwt } from "@/contexts/shared/auth/domain/jwt";
import { Role } from "@/contexts/shared/users/domain/role/role-name";
import { User } from "@/contexts/shared/users/domain/user";
import { UserRepository } from "@/contexts/shared/users/domain/user-repository";
import { UserRole } from "@/contexts/shared/users/domain/user-role";

import { EnviromentVariables } from "@/core/config/configuration";

import { prepareRolesInDB, prepareUsersInDB } from "../helper";

describe("UserPutController (e2e)", () => {
  let app: NestFastifyApplication;
  let repo: UserRepository;
  let configService: ConfigService<EnviromentVariables>;
  let jwt: Jwt;
  let roles: UserRole[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [...baseTestModuleImports(), UserModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    repo = await app.get(UserRepository);
    configService = await app.get(ConfigService);
    jwt = await app.get(Jwt);
    roles = await prepareRolesInDB(repo);
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

  describe("/v1/api/users (PUT)", () => {
    let users: User[];
    let token: string;

    beforeEach(async () => {
      const prepare = await prepareUsersInDB(repo, configService, jwt, roles);
      users = prepare.users;
      token = prepare.token;
    });

    it("should create a new user if not already registry", async () => {
      const id = UserIdMother.create().value;
      const request = SignupPostRequestMother.create({
        roles: [Role.SERVICE_OVERSEER],
      });

      const response = await app.inject({
        method: "PUT",
        url: `/users/${id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: request,
      });

      expect(response.statusCode).toBe(201);
      expect(response.headers.Location).not.toBeNull();
    });

    it("should update user with id already registry", async () => {
      const id = users[0].id.value;
      const request = {
        email: UserEmailMother.create().value,
        password: UserPasswordMother.create().value,
      };

      const response = await app.inject({
        method: "PUT",
        url: `/users/${id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: request,
      });

      expect(response.statusCode).toBe(200);
    });

    it("should update roles of user with id already registry", async () => {
      const id = users[0].id.value;
      const request = {
        roles: [Role.PUBLISHER, Role.PUBLIC_WITNESSING],
      };

      const response = await app.inject({
        method: "PUT",
        url: `/users/${id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: request,
      });

      expect(response.statusCode).toBe(200);
    });
  });
});
