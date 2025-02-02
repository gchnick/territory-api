import Logger from "@/shared/domain/logger";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { Encode } from "@/contexts/shared/auth/domain/encode";
import { UserCreator } from "@/contexts/shared/users/application/create/user-creator";
import { RoleName } from "@/contexts/shared/users/domain/role/role-name";
import { User } from "@/contexts/shared/users/domain/user";
import { UserEmail } from "@/contexts/shared/users/domain/user-email";
import { UserEmailAlreadyRegistry } from "@/contexts/shared/users/domain/user-email-already-registry";
import { UserId } from "@/contexts/shared/users/domain/user-id";
import { UserPassword } from "@/contexts/shared/users/domain/user-password";
import {
  PartialUserPrimitive,
  UserRepository,
} from "@/contexts/shared/users/domain/user-repository";

@Injectable()
export class UserUpdater {
  constructor(
    private readonly logger: Logger,
    private readonly repository: UserRepository,
    private readonly encode: Encode,
  ) {}

  async update(
    id: UserId,
    params: {
      email?: UserEmail;
      password?: UserPassword;
      roles?: RoleName[];
    },
  ): Promise<void> {
    this.logger.log(`Updating user by id <${id.value}>`, "User");

    const { email, password, roles } = params;
    const userRoles = await UserCreator.rolesParse(
      this.repository,
      this.logger,
      roles,
    );

    const passwordHashed = password?.value
      ? await this.encode.hash(password.value, User.SALT_OR_ROUNDS_ENCODE)
      : undefined;

    const primitive: PartialUserPrimitive = {
      email: email?.value,
      roles: userRoles.map(r => r.toPrimitives()),
      password: passwordHashed,
    };

    try {
      await this.repository.update(id, primitive);
    } catch (error) {
      if (error instanceof UserEmailAlreadyRegistry) {
        throw new UserEmailAlreadyRegistry(
          `User Email <${params.email?.value}> already registry`,
        );
      }
    }
  }
}
