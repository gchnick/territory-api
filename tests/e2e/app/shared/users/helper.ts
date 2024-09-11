import {
  Role,
  RoleName,
} from "@/src/contexts/shared/users/domain/role/role-name";
import { User } from "@/src/contexts/shared/users/domain/user";
import { UserRepository } from "@/src/contexts/shared/users/domain/user-repository";
import { UserRole } from "@/src/contexts/shared/users/domain/user-role";

import { UserMother } from "../../../../unit/src/context/shared/users/domain/user-mother";
import { UserRoleMother } from "../../../../unit/src/context/shared/users/domain/user-role-mother";

export const createAllRoles = (): UserRole[] =>
  Object.keys(Role).map(r =>
    UserRoleMother.create({ name: RoleName.fromValue(r).value }),
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
): Promise<void> => {
  for (const r of roles) {
    await repo.saveRole(r);
  }
};

export const saveInitialUsers = async (
  repo: UserRepository,
  users: User[],
): Promise<void> => {
  for (const u of users) {
    await repo.save(u);
  }
};
