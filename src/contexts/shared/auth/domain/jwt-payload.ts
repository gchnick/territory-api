import { Role } from "@/contexts/shared/users/domain/role/role-name";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface JwtPayload {
  id: string;
  email: string;
  roles: Role[];
}
