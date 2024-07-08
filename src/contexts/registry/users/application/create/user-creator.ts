import { Encode } from "@/contexts/registry/auth/domain/encode";
import { User } from "@/contexts/registry/users/domain/user";
import { UserEmail } from "@/contexts/registry/users/domain/user-email";
import { UserEnabled } from "@/contexts/registry/users/domain/user-enabled";
import { UserId } from "@/contexts/registry/users/domain/user-id";
import { UserName } from "@/contexts/registry/users/domain/user-name";
import { UserPassword } from "@/contexts/registry/users/domain/user-password";
import { UserRepository } from "@/contexts/registry/users/domain/user-repository";
import { UserVerified } from "@/contexts/registry/users/domain/user-verified";
import { EventBus } from "@/contexts/shared/domain/event-bus";
import Logger from "@/contexts/shared/domain/logger";
import { Injectable } from "@/contexts/shared/infrastructure/dependency-injection/injectable";

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
