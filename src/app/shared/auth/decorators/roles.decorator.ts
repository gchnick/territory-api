import { SetMetadata } from "@nestjs/common";

import { Role } from "@/src/contexts/shared/users/domain/role/role-name";

export const ROLES_KEY = "roles";
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);