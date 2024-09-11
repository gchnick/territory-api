import { EventBus } from "@/shared/domain/event-bus";
import Logger from "@/shared/domain/logger";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { Encode } from "@/src/contexts/shared/auth/domain/encode";

import { RoleName } from "../../domain/role/role-name";
import { User } from "../../domain/user";
import { UserEmail } from "../../domain/user-email";
import { UserEmailAlreadyRegistry } from "../../domain/user-email-already-registry";
import { UserId } from "../../domain/user-id";
import { UserName } from "../../domain/user-name";
import { UserPassword } from "../../domain/user-password";
import { UserRepository } from "../../domain/user-repository";
import { UserCreator } from "../create/user-creator";

@Injectable()
export class UserUpdater {
  constructor(
    private readonly logger: Logger,
    private readonly repository: UserRepository,
    private readonly encode: Encode,
    private readonly eventBus: EventBus,
  ) {}

  async update(
    id: UserId,
    params: {
      name?: UserName;
      email?: UserEmail;
      password?: UserPassword;
      roles?: RoleName[];
    },
  ): Promise<void> {
    this.logger.log(`Updating user by id <${id.value}>`, "User");

    const userCreator = new UserCreator(
      this.logger,
      this.repository,
      this.encode,
      this.eventBus,
    );

    const { name, email, password, roles } = params;

    try {
      if (name && email && password && roles) {
        await userCreator.create({ id, name, email, password, roles });
      } else {
        const passwordHashed = password?.value
          ? await this.encode.hash(password.value, User.SALT_OR_ROUNDS_ENCODE)
          : undefined;
        const userRoles = await userCreator.rolesParse(roles);

        const _params = {
          ...params,
          password: passwordHashed,
          roles: userRoles,
        };

        await this.repository.update(id, _params);
      }
    } catch (error) {
      if (error instanceof UserEmailAlreadyRegistry) {
        throw new UserEmailAlreadyRegistry(
          `User Email <${params.email?.value}> already registry`,
        );
      }
    }
  }
}
