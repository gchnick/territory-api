import { User } from '@users/domain/user';

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  password: string;
  verified: boolean;
  enabled: boolean;
  roles: string[];
}

export class UserResponse {
  public readonly value: IUserResponse;

  constructor(user: User) {
    this.value = user.toPrimitives();
  }
}
