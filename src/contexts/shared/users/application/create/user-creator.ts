import { EventBus } from "@/shared/domain/event-bus";
import Logger from "@/shared/domain/logger";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { Encode } from "@/contexts/shared/auth/domain/encode";
import { RoleName } from "@/contexts/shared/users/domain/role/role-name";
import { User } from "@/contexts/shared/users/domain/user";
import { UserEmail } from "@/contexts/shared/users/domain/user-email";
import { UserEnabled } from "@/contexts/shared/users/domain/user-enabled";
import { UserId } from "@/contexts/shared/users/domain/user-id";
import { UserPassword } from "@/contexts/shared/users/domain/user-password";
import { UserRepository } from "@/contexts/shared/users/domain/user-repository";
import { UserRole } from "@/contexts/shared/users/domain/user-role";
import { UserRoleNotFount } from "@/contexts/shared/users/domain/user-role-not-fount";
import { UserVerified } from "@/contexts/shared/users/domain/user-verified";

@Injectable()
export class UserCreator {
  constructor(
    private readonly logger: Logger,
    private readonly repository: UserRepository,
    private readonly encode: Encode,
    private readonly eventBus: EventBus,
  ) {}

  async create(params: {
    id: UserId;
    email: UserEmail;
    password: UserPassword;
    roles: RoleName[];
  }): Promise<void> {
    const verifiedDefault = new UserVerified(false);
    const enabledDefault = new UserEnabled(true);
    const userRoles = await UserCreator.rolesParse(
      this.repository,
      this.logger,
      params.roles,
    );

    const user = User.create(
      params.id,
      params.email,
      params.password,
      verifiedDefault,
      enabledDefault,
      userRoles,
    );

    this.logger.log(`Saving new user <${user.email.value}>`, "User");

    const userWithPasswordHashed = await user.hashPassword(this.encode);

    await this.repository.save(userWithPasswordHashed);
    await this.eventBus.publish(user.pullDomainEvents());
  }

  static async rolesParse(
    repository: UserRepository,
    logger: Logger,
    values?: RoleName[],
  ): Promise<UserRole[]> {
    const roles: UserRole[] = [];

    if (!values) {
      return roles;
    }

    for (const role of values) {
      const data = await repository.findRole(role);
      if (!data) {
        logger.warn(`User role <${role.value}> not fount`, "User");
        throw new UserRoleNotFount(`User role <${role.value}> not fount`);
      }
      roles.push(data);
    }

    return roles;
  }
}
