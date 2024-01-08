import { Encode } from '@auth/domain/encode';
import { EventBus } from '@shared/domain/event-bus';
import Logger from '@shared/domain/logger';
import { User } from '@users/domain/user';
import { UserEmail } from '@users/domain/user-email';
import { UserEnabled } from '@users/domain/user-enabled';
import { UserId } from '@users/domain/user-id';
import { UserName } from '@users/domain/user-name';
import { UserPassword } from '@users/domain/user-password';
import { UserRepository } from '@users/domain/user-repository';
import { UserRole } from '@users/domain/user-role';
import { UserVerified } from '@users/domain/user-verified';

export class UserCreator {
  constructor(
    private log: Logger,
    private repository: UserRepository,
    private encode: Encode,
    private eventBus: EventBus,
  ) {
    this.log.setContext('User');
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
    this.log.info(`Saving new user <${user.email}>`);
    const userWithPasswordHashed = await user.hashPassword(this.encode);
    await this.repository.save(userWithPasswordHashed);
    await this.eventBus.publish(user.pullDomainEvents());
  }
}
