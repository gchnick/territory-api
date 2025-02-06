import { ConfigService } from "@nestjs/config";

import { RolesMother } from "@/tests/unit/src/contexts/shared/users/domain/role/role-name-mother";
import { UserMother } from "@/tests/unit/src/contexts/shared/users/domain/user-mother";
import { UserRoleMother } from "@/tests/unit/src/contexts/shared/users/domain/user-role-mother";

import { Jwt } from "@/contexts/shared/auth/domain/jwt";
import { JwtPayload } from "@/contexts/shared/auth/domain/jwt-payload";
import { Role, RoleName } from "@/contexts/shared/users/domain/role/role-name";
import { User } from "@/contexts/shared/users/domain/user";
import { UserRepository } from "@/contexts/shared/users/domain/user-repository";
import { UserRole } from "@/contexts/shared/users/domain/user-role";

import { EnviromentVariables } from "@/core/config/configuration";

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

export const prepareRolesInDB = async (repo: UserRepository) => {
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
  configService: ConfigService<EnviromentVariables>,
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
  repo: UserRepository,
  configService: ConfigService<EnviromentVariables>,
  jwt: Jwt,
  roles: UserRole[],
  password?: string,
) => {
  await repo.deleteAll();
  const users = createUsers(roles, password);
  await saveInitialUsers(repo, users);
  const token = await generateToken(users[0], configService, jwt);
  return { users, token };
};
