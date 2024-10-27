import { EventBus } from "@/shared/domain/event-bus";
import Logger from "@/shared/domain/logger";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { Encode } from "@/contexts/shared/auth/domain/encode";
import { User } from "@/contexts/shared/users/domain/user";
import { UserEmail } from "@/contexts/shared/users/domain/user-email";
import { UserEnabled } from "@/contexts/shared/users/domain/user-enabled";
import { UserId } from "@/contexts/shared/users/domain/user-id";
import { UserPassword } from "@/contexts/shared/users/domain/user-password";
import { UserRepository } from "@/contexts/shared/users/domain/user-repository";
import { UserVerified } from "@/contexts/shared/users/domain/user-verified";

import { RoleName } from "../../domain/role/role-name";
import { UserRole } from "../../domain/user-role";
import { UserRoleNotFount } from "../../domain/user-role-not-fount";

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
    const userRoles = await this.rolesParse(params.roles);

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

  async rolesParse(values?: RoleName[]): Promise<UserRole[]> {
    const roles: UserRole[] = [];

    if (!values) {
      return roles;
    }

    for (const role of values) {
      const data = await this.repository.findRole(role);
      if (!data) {
        this.logger.warn(`User role <${role.value}> not fount`, "User");
        throw new UserRoleNotFount(`User role <${role.value}> not fount`);
      }
      roles.push(data);
    }

    return roles;
  }
}
