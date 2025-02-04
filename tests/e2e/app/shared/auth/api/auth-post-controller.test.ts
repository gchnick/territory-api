import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Test, TestingModule } from "@nestjs/testing";
import * as nock from "nock";

import { baseTestModuleImports } from "@/tests/e2e/app/helpers/base-test-module-imports";
import {
  prepareRolesInDB,
  prepareUsersInDB,
} from "@/tests/e2e/app/shared/users/helper";

import { AuthModule } from "@/app/shared/auth/auth.module";
import { UserModule } from "@/app/shared/user/user.module";

import { User } from "@/contexts/shared/users/domain/user";
import { UserRepository } from "@/contexts/shared/users/domain/user-repository";
import { UserRole } from "@/contexts/shared/users/domain/user-role";

import { AuthPostRequestMother } from "../requests/auth-post-request-mother";
import { SignupPostRequestMother } from "../requests/signup-post-request-mother";

describe("AuthPostController (e2e)", () => {
  let app: NestFastifyApplication;
  let repo: UserRepository;
  let roles: UserRole[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [...baseTestModuleImports(), UserModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    repo = await app.get(UserRepository);
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

  describe("/v1/api/auth/login (POST)", () => {
    let users: Array<User>;
    beforeEach(async () => {
      users = await prepareUsersInDB(repo, roles);
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
        url: "/auth/login",
        payload: request,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("access_token");
    });

    it("should throw 401 with invalid credentials", async () => {
      const request = AuthPostRequestMother.create();

      const response = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: request,
      });

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
    });

    it("should signup a new user", async () => {
      const request = SignupPostRequestMother.create({
        roles: ["SERVICE_OVERSEER"],
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
