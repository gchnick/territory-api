import { User } from "@src/contexts/registry/users/domain/user";
import { UserEmail } from "@src/contexts/registry/users/domain/user-email";
import { UserEnabled } from "@src/contexts/registry/users/domain/user-enabled";
import { UserId } from "@src/contexts/registry/users/domain/user-id";
import { UserName } from "@src/contexts/registry/users/domain/user-name";
import { UserPassword } from "@src/contexts/registry/users/domain/user-password";
import { UserRepository } from "@src/contexts/registry/users/domain/user-repository";
import { UserRole } from "@src/contexts/registry/users/domain/user-role";
import { UserVerified } from "@src/contexts/registry/users/domain/user-verified";

import { Encode } from "@contexts/registry/auth/domain/encode";
import { EventBus } from "@contexts/shared/domain/event-bus";
import Logger from "@contexts/shared/domain/logger";

export class UserCreator {
  constructor(
    private log: Logger,
    private repository: UserRepository,
    private encode: Encode,
    private eventBus: EventBus,
  ) {
    this.log.setContext("User");
  }

  async run(params: {
    id: UserId;
    name: UserName;
    email: UserEmail;
    password: UserPassword;
    roles: UserRole[];
  }): Promise<void> {
    const verifiedDefault = new UserVerified(false);
    const enabledDefault = new UserEnabled(true);
    const user = User.create(
      params.id,
      params.name,
      params.email,
      params.password,
      verifiedDefault,
      enabledDefault,
      params.roles,
    );
    this.log.info(`Saving new user <${user.email.value}>`);
    const userWithPasswordHashed = await user.hashPassword(this.encode);
    await this.repository.save(userWithPasswordHashed);
    await this.eventBus.publish(user.pullDomainEvents());
  }
}
