import { Encode } from '@auth/domain/encode';
import { Jwt } from '@auth/domain/jwt';
import { JwtPayload } from '@auth/domain/jwt-payload';
import Logger from '@shared/domain/logger';
import { UserCredentialInvalid } from '@users/domain/user-credential-invalid';
import { UserDisabled } from '@users/domain/user-disabled';
import { UserEmail } from '@users/domain/user-email';
import { UserNotFount } from '@users/domain/user-not-fount';
import { UserPassword } from '@users/domain/user-password';
import { UserRepository } from '@users/domain/user-repository';
import { UserUnverified } from '@users/domain/user-unverified';
import { AuthResponse } from './auth-response';

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

    this.log.info(`Cheking authentication user <${user.name}>`);
    const isMatch = await user.comparePassword(this.encode, password);

    if (!isMatch) {
      throw new UserCredentialInvalid('Credentials are not valid');
    }

    if (!user.verified) {
      throw new UserUnverified(
        `The user <${user.name}> is unverified. Please, check your email to confirm your account`,
      );
    }

    if (!user.enabled) {
      throw new UserDisabled(
        `The user <${user.name}> is disabled. Please, contact your administrator`,
      );
    }

    const payload: JwtPayload = {
      id: user.id.value,
      email: user.email.value,
      roles: user.roles.map((r) => r.value),
    };
    const token = await this.jwt.signAsync(payload);

    return new AuthResponse(token);
  }
}
