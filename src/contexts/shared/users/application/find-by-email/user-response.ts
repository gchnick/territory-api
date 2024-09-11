import { User, UserPrimitives } from "@/src/contexts/shared/users/domain/user";

export class UserResponse {
  public readonly data: Omit<UserPrimitives, "password">;

  constructor(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...withoutPassword } = user.toPrimitives();
    this.data = withoutPassword;
  }
}
