import { Role } from "@/src/contexts/shared/users/domain/role/role-name";

export interface JwtPayload {
  id: string;
  email: string;
  roles: Role[];
}
