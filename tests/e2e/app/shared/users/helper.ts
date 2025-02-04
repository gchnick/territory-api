import { UserMother } from "@/tests/unit/src/contexts/shared/users/domain/user-mother";
import { UserRoleMother } from "@/tests/unit/src/contexts/shared/users/domain/user-role-mother";

import { Role, RoleName } from "@/contexts/shared/users/domain/role/role-name";
import { User } from "@/contexts/shared/users/domain/user";
import { UserRepository } from "@/contexts/shared/users/domain/user-repository";
import { UserRole } from "@/contexts/shared/users/domain/user-role";

const createAllRoles = (): UserRole[] =>
  Object.keys(Role).map((role, index) =>
    UserRoleMother.create({ id: index, name: RoleName.fromValue(role).value }),
  );

const saveInitialRoles = async (
  repo: UserRepository,
  roles: UserRole[],
): Promise<void[]> => {
  return Promise.all(roles.map(role => repo.saveRole(role)));
};

export const prepareRolesInDB = async (repo: UserRepository) => {
  const roles = createAllRoles();
  await repo.deleteAllRoles();
  await saveInitialRoles(repo, roles);
  return roles;
};

const createUsers = (roles: UserRole[]): User[] => {
  const overseer = roles.find(r => r.name.value === Role.SERVICE_OVERSEER);
  return overseer
    ? [UserMother.create({ roles: [overseer.toPrimitives()] })]
    : [];
};

const saveInitialUsers = async (
  repo: UserRepository,
  users: User[],
): Promise<void[]> => {
  return Promise.all(users.map(user => repo.save(user)));
};

export const prepareUsersInDB = async (
  repo: UserRepository,
  roles: UserRole[],
) => {
  await repo.deleteAll();
  const users = createUsers(roles);
  await saveInitialUsers(repo, users);
  return users;
};
