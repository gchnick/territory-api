import { Role } from "@/contexts/registry/users/domain/role/role-name";

export interface JwtPayload {
  id: string;
  email: string;
  roles: Role[];
}
