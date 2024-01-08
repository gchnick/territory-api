import { Role } from '@users/domain/user-role';

export interface JwtPayload {
  id: string;
  email: string;
  roles: Role[];
}
