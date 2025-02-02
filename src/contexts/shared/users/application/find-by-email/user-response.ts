import { User, UserPrimitives } from "@/contexts/shared/users/domain/user";

export class UserResponse {
  public readonly data: Omit<UserPrimitives, "password">;

  constructor(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...withoutPassword } = user.toPrimitives();
    this.data = withoutPassword;
  }
}
