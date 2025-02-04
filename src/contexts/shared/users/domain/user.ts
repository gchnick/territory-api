import { AggregateRoot } from "@/shared/domain/aggregate-root";

import { Encode } from "@/contexts/shared/auth/domain/encode";

import { UserCreatedDomainEvent } from "./user-created-domain-event";
import { UserEmail } from "./user-email";
import { UserEnabled } from "./user-enabled";
import { UserId } from "./user-id";
import { UserPassword } from "./user-password";
import { UserRole, UserRolePrimitives } from "./user-role";
import { UserVerified } from "./user-verified";

export type UserPrimitives = {
  id: string;
  email: string;
  password: string;
  verified: boolean;
  enabled: boolean;
  roles: UserRolePrimitives[];
};

export class User extends AggregateRoot {
  static SALT_OR_ROUNDS_ENCODE = 10;

  readonly id: UserId;
  readonly email: UserEmail;
  readonly password: UserPassword;
  readonly verified: UserVerified;
  readonly enabled: UserEnabled;
  readonly roles: UserRole[];

  constructor(
    id: UserId,
    email: UserEmail,
    password: UserPassword,
    verified: UserVerified,
    enabled: UserEnabled,
    roles: UserRole[],
  ) {
    super();
    this.id = id;
    this.email = email;
    this.password = password;
    this.verified = verified;
    this.enabled = enabled;
    this.roles = roles;
  }

  async hashPassword(encode: Encode): Promise<User> {
    const passwordHashed = await encode.hash(
      this.password.value,
      User.SALT_OR_ROUNDS_ENCODE,
    );
    return new User(
      this.id,
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
    return encode.compare(password.value, this.password.value);
  }

  static create(
    id: UserId,
    email: UserEmail,
    password: UserPassword,
    verified: UserVerified,
    enabled: UserEnabled,
    roles: UserRole[],
  ): User {
    const user = new User(id, email, password, verified, enabled, roles);

    user.record(
      new UserCreatedDomainEvent({
        aggregateId: user.id.value,
        email: user.email.value,
        roles: user.roles.map(r => r.name.value),
      }),
    );

    return user;
  }

  static fromPrimitives(plainData: {
    id: string;
    email: string;
    password: string;
    verified: boolean;
    enabled: boolean;
    roles: UserRolePrimitives[];
  }): User {
    return new User(
      new UserId(plainData.id),
      new UserEmail(plainData.email),
      new UserPassword(plainData.password),
      new UserVerified(plainData.verified),
      new UserEnabled(plainData.enabled),
      plainData.roles.map(({ id, name, description }) =>
        UserRole.fromPrimitives({ id, name, description }),
      ),
    );
  }

  toPrimitives(): UserPrimitives {
    return {
      id: this.id.value,
      email: this.email.value,
      password: this.password.value,
      verified: this.verified.value,
      enabled: this.enabled.value,
      roles: this.roles.map(r => r.toPrimitives()),
    };
  }
}
