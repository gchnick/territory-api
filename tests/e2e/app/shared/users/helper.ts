import { UserMother } from "@/tests/unit/src/contexts/shared/users/domain/user-mother";
import { UserRoleMother } from "@/tests/unit/src/contexts/shared/users/domain/user-role-mother";

import { Role, RoleName } from "@/contexts/shared/users/domain/role/role-name";
import { User } from "@/contexts/shared/users/domain/user";
import { UserRepository } from "@/contexts/shared/users/domain/user-repository";
import { UserRole } from "@/contexts/shared/users/domain/user-role";

export const createAllRoles = (): UserRole[] =>
  Object.keys(Role).map((role, index) =>
    UserRoleMother.create({ id: index, name: RoleName.fromValue(role).value }),
  );

export const createUsers = (roles: UserRole[]): User[] => {
  const overseer = roles.find(r => r.name.value === Role.SERVICE_OVERSEER);
  return overseer
    ? [UserMother.create({ roles: [overseer.toPrimitives()] })]
    : [];
};

export const saveInitialRoles = async (
  repo: UserRepository,
  roles: UserRole[],
): Promise<void[]> => {
  return Promise.all(roles.map(role => repo.saveRole(role)));
};

export const saveInitialUsers = async (
  repo: UserRepository,
  users: User[],
): Promise<void[]> => {
  return Promise.all(users.map(user => repo.save(user)));
};
