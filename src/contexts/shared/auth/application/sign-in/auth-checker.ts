import Logger from "@/shared/domain/logger";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { Encode } from "@/contexts/shared/auth/domain/encode";
import { Jwt } from "@/contexts/shared/auth/domain/jwt";
import { JwtPayload } from "@/contexts/shared/auth/domain/jwt-payload";
import { UserCredentialInvalid } from "@/contexts/shared/users/domain/user-credential-invalid";
import { UserDisabled } from "@/contexts/shared/users/domain/user-disabled";
import { UserEmail } from "@/contexts/shared/users/domain/user-email";
import { UserPassword } from "@/contexts/shared/users/domain/user-password";
import { UserRepository } from "@/contexts/shared/users/domain/user-repository";
import { UserUnverified } from "@/contexts/shared/users/domain/user-unverified";

import { AuthResponse } from "./auth-response";

@Injectable()
export class AuthChecker {
  constructor(
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
    private readonly encode: Encode,
    private readonly jwt: Jwt,
  ) {}

  async check(email: UserEmail, password: UserPassword) {
    this.logger.log(`Finding user by email <${email.value}>`, "User");
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UserCredentialInvalid("Credentials are not valid");
    }

    this.logger.log(`Cheking authentication user <${user.name.value}>`, "User");
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
      roles: user.roles.map(r => r.name.value),
    };
    const token = await this.jwt.signAsync(payload);

    return new AuthResponse(token);
  }
}
