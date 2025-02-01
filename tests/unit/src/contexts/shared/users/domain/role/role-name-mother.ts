import {
  Role,
  RoleName,
} from "@/src/contexts/shared/users/domain/role/role-name";

export const RoleNameMother = {
  create(role?: string): RoleName {
    const randomRole =
      Object.values(Role)[
        Math.floor(Math.random() * Object.values(Role).length)
      ];
    return role ? RoleName.fromValue(role) : new RoleName(randomRole);
  },
};
