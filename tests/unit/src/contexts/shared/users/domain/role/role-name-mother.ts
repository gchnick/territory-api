import { Role, RoleName } from "@/contexts/shared/users/domain/role/role-name";

export const RoleNameMother = {
  create(role?: string): RoleName {
    const randomRole =
      Object.values(Role)[
        Math.floor(Math.random() * Object.values(Role).length)
      ];
    return role ? RoleName.fromValue(role) : new RoleName(randomRole);
  },
};

export const RolesMother = {
  create(roles?: string[]): Role[] {
    return roles
      ? roles.map(role => RoleName.fromValue(role).value)
      : Object.keys(Role).map(role => RoleName.fromValue(role).value);
  },
};
