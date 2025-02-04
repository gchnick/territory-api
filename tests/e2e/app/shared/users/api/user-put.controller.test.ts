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

import { User } from "@/contexts/shared/users/domain/user";
import { UserRepository } from "@/contexts/shared/users/domain/user-repository";
import { UserRole } from "@/contexts/shared/users/domain/user-role";

import { prepareRolesInDB, prepareUsersInDB } from "../helper";

describe("UserPutController (e2e)", () => {
  let app: NestFastifyApplication;
  let repo: UserRepository;
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
    let users: Array<User>;
    beforeEach(async () => {
      users = await prepareUsersInDB(repo, roles);
    });

    it("should create a new user if not already registry", async () => {
      const id = UserIdMother.create();
      const request = SignupPostRequestMother.create({
        roles: ["SERVICE_OVERSEER"],
      });

      const response = await app.inject({
        method: "PUT",
        url: `/users/${id.value}`,
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
        url: `/users/${id}`,
        payload: request,
      });

      expect(response.statusCode).toBe(200);
    });
  });
});
