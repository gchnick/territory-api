import { Encode } from "@contexts/registry/auth/domain/encode";
import { Jwt } from "@contexts/registry/auth/domain/jwt";
import { JwtPayload } from "@contexts/registry/auth/domain/jwt-payload";
import { UserCredentialInvalid } from "@contexts/registry/users/domain/user-credential-invalid";
import { UserDisabled } from "@contexts/registry/users/domain/user-disabled";
import { UserEmail } from "@contexts/registry/users/domain/user-email";
import { UserNotFount } from "@contexts/registry/users/domain/user-not-fount";
import { UserPassword } from "@contexts/registry/users/domain/user-password";
import { UserRepository } from "@contexts/registry/users/domain/user-repository";
import { UserUnverified } from "@contexts/registry/users/domain/user-unverified";
import Logger from "@contexts/shared/domain/logger";

import { AuthResponse } from "./auth-response";

export class AuthChecker {
  constructor(
    private log: Logger,
    private userRepository: UserRepository,
    private encode: Encode,
    private jwt: Jwt,
  ) {}

  async run(email: UserEmail, password: UserPassword) {
    this.log.info(`Finding user by email <${email.value}>`);
    const user = await this.userRepository.findOne(email);

    if (!user) {
      throw new UserNotFount(`User with email <${email.value}> not found`);
    }

    this.log.info(`Cheking authentication user <${user.name.value}>`);
    const isMatch = await user.comparePassword(this.encode, password);

    if (!isMatch) {
      throw new UserCredentialInvalid("Credentials are not valid");
    }

    if (!user.verified) {
      throw new UserUnverified(
        `The user <${user.name.value}> is unverified. Please, check your email to confirm your account`,
      );
    }

    if (!user.enabled) {
      throw new UserDisabled(
        `The user <${user.name.value}> is disabled. Please, contact your administrator`,
      );
    }

    const payload: JwtPayload = {
      id: user.id.value,
      email: user.email.value,
      roles: user.roles.map(r => r.value),
    };
    const token = await this.jwt.signAsync(payload);

    return new AuthResponse(token);
  }
}
