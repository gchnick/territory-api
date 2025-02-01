import {
  UserRole,
  UserRolePrimitives,
} from "@/src/contexts/shared/users/domain/user-role";

import { RoleDescriptionMother } from "./role/role-description-mother";
import { RoleIdMother } from "./role/role-id-mother";
import { RoleNameMother } from "./role/role-name-mother";

export const UserRoleMother = {
  create(params?: Partial<UserRolePrimitives>): UserRole {
    const primitives: UserRolePrimitives = {
      id: RoleIdMother.create().value,
      name: RoleNameMother.create().value,
      description: RoleDescriptionMother.create().value,
      ...params,
    };

    return UserRole.fromPrimitives(primitives);
  },
};
