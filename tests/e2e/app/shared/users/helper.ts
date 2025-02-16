import type { EnvironmentVariables } from "@/core/config/configuration";

import { ConfigService } from "@nestjs/config";
import { NestFastifyApplication } from "@nestjs/platform-fastify";

import { RolesMother } from "@/tests/unit/src/contexts/shared/users/domain/role/role-name-mother";
import { UserMother } from "@/tests/unit/src/contexts/shared/users/domain/user-mother";
import { UserRoleMother } from "@/tests/unit/src/contexts/shared/users/domain/user-role-mother";

import { Jwt } from "@/contexts/shared/auth/domain/jwt";
import { JwtPayload } from "@/contexts/shared/auth/domain/jwt-payload";
import { Role, RoleName } from "@/contexts/shared/users/domain/role/role-name";
import { User } from "@/contexts/shared/users/domain/user";
import { UserRepository } from "@/contexts/shared/users/domain/user-repository";
import { UserRole } from "@/contexts/shared/users/domain/user-role";

const createAllRoles = (): UserRole[] =>
  RolesMother.create().map((role, index) =>
    UserRoleMother.create({ id: index, name: RoleName.fromValue(role).value }),
  );

const saveInitialRoles = async (
  repo: UserRepository,
  roles: UserRole[],
): Promise<void> => {
  await Promise.all(roles.map(role => repo.saveRole(role)));
};

export const prepareRolesInDB = async (app: NestFastifyApplication) => {
  const repo = app.get(UserRepository);
  const roles = createAllRoles();
  await repo.deleteAllRoles();
  await saveInitialRoles(repo, roles);
  return roles;
};

const createUsers = (roles: UserRole[], password?: string): User[] => {
  const overseer = roles.find(r => r.name.value === Role.SERVICE_OVERSEER);
  if (!overseer) return [];
  return password
    ? [
        UserMother.create({
          roles: [overseer.toPrimitives()],
          password,
          enabled: true,
          verified: true,
        }),
      ]
    : [
        UserMother.create({
          roles: [overseer.toPrimitives()],
          enabled: true,
          verified: true,
        }),
      ];
};

const saveInitialUsers = async (
  repo: UserRepository,
  users: User[],
): Promise<void> => {
  await Promise.all(users.map(user => repo.save(user)));
};

const generateToken = async (
  user: User,
  configService: ConfigService<EnvironmentVariables>,
  jwt: Jwt,
) => {
  const payload: JwtPayload = {
    id: user.id.value,
    email: user.email.value,
    roles: user.roles.map(r => r.name.value),
  };
  const secret = configService.get<string>("JWT_SECRET");
  return jwt.signAsync(payload, { secret });
};

export const prepareUsersInDB = async (
  app: NestFastifyApplication,
  roles: UserRole[],
  password?: string,
) => {
  const repo = app.get(UserRepository);
  const configService = app.get(ConfigService);
  const jwt = app.get(Jwt);
  const users = createUsers(roles, password);

  await repo.deleteAll();
  await saveInitialUsers(repo, users);
  const token = await generateToken(users[0], configService, jwt);
  return { users, token };
};
