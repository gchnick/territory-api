import { Role } from "@src/contexts/registry/users/domain/user-role";

export interface JwtPayload {
  id: string;
  email: string;
  roles: Role[];
}
