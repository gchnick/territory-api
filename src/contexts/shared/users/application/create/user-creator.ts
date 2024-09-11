import { EventBus } from "@/shared/domain/event-bus";
import Logger from "@/shared/domain/logger";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { Encode } from "@/src/contexts/shared/auth/domain/encode";
import { User } from "@/src/contexts/shared/users/domain/user";
import { UserEmail } from "@/src/contexts/shared/users/domain/user-email";
import { UserEnabled } from "@/src/contexts/shared/users/domain/user-enabled";
import { UserId } from "@/src/contexts/shared/users/domain/user-id";
import { UserName } from "@/src/contexts/shared/users/domain/user-name";
import { UserPassword } from "@/src/contexts/shared/users/domain/user-password";
import { UserRepository } from "@/src/contexts/shared/users/domain/user-repository";
import { UserVerified } from "@/src/contexts/shared/users/domain/user-verified";

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
    name: UserName;
    email: UserEmail;
    password: UserPassword;
    roles: RoleName[];
  }): Promise<void> {
    const verifiedDefault = new UserVerified(false);
    const enabledDefault = new UserEnabled(true);
    const userRoles = await this.rolesParse(params.roles);

    const user = User.create(
      params.id,
      params.name,
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
