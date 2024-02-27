import { SetMetadata } from "@nestjs/common";

import { Role } from "@src/contexts/registry/users/domain/user-role";

export const ROLES_KEY = "roles";
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
