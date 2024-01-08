import { Encode } from '@auth/domain/encode';
import { AggregateRoot } from '@shared/domain/aggregate-root';
import { UserCreatedDomainEvent } from './user-created-domain-event';
import { UserEmail } from './user-email';
import { UserEnabled } from './user-enabled';
import { UserId } from './user-id';
import { UserName } from './user-name';
import { UserPassword } from './user-password';
import { UserRole } from './user-role';
import { UserVerified } from './user-verified';

export class User extends AggregateRoot {
  static #SALT_OR_ROUNDS_ENCODE = 10;

  readonly id: UserId;
  readonly name: UserName;
  readonly email: UserEmail;
  readonly password: UserPassword;
  readonly verified: UserVerified;
  readonly enabled: UserEnabled;
  readonly roles: UserRole[];

  constructor(
    id: UserId,
    name: UserName,
    email: UserEmail,
    password: UserPassword,
    verified: UserVerified,
    enabled: UserEnabled,
    roles: UserRole[],
  ) {
    super();
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.verified = verified;
    this.enabled = enabled;
    this.roles = roles;
  }

  async hashPassword(encode: Encode): Promise<User> {
    const passwordHashed = await encode.hash(
      this.password.value,
      User.#SALT_OR_ROUNDS_ENCODE,
    );
    return new User(
      this.id,
      this.name,
      this.email,
      new UserPassword(passwordHashed),
      this.verified,
      this.enabled,
      this.roles,
    );
  }

  async comparePassword(
    encode: Encode,
    password: UserPassword,
  ): Promise<boolean> {
    return await encode.compare(password.value, this.password.value);
  }

  static create(
    id: UserId,
    name: UserName,
    email: UserEmail,
    password: UserPassword,
    verified: UserVerified,
    enabled: UserEnabled,
    roles: UserRole[],
  ): User {
    const user = new User(id, name, email, password, verified, enabled, roles);

    user.record(
      new UserCreatedDomainEvent({
        aggregateId: user.id.value,
        name: user.name.value,
        email: user.email.value,
      }),
    );

    return user;
  }

  static fromPrimitive(plainData: {
    id: string;
    name: string;
    email: string;
    password: string;
    verified: boolean;
    enabled: boolean;
    roles: string[];
  }): User {
    return new User(
      new UserId(plainData.id),
      new UserName(plainData.name),
      new UserEmail(plainData.email),
      new UserPassword(plainData.password),
      new UserVerified(plainData.verified),
      new UserEnabled(plainData.enabled),
      plainData.roles.map((r) => UserRole.fromValue(r)),
    );
  }

  toPrimitives() {
    return {
      id: this.id.value,
      name: this.name.value,
      email: this.email.value,
      password: this.password.value,
      verified: this.verified.value,
      enabled: this.enabled.value,
      roles: this.roles.map((r) => r.value),
    };
  }
}
