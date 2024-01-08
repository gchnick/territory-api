import Logger from '@shared/domain/logger';
import { UserEmail } from '@users/domain/user-email';
import { UserNotFount } from '@users/domain/user-not-fount';
import { UserRepository } from '@users/domain/user-repository';
import { UserResponse } from './user-response';

export class UserFinder {
  constructor(
    private log: Logger,
    private userRepository: UserRepository,
  ) {}

  async run(email: UserEmail) {
    this.log.info(`Finding user by email <${email.value}>`);
    const user = await this.userRepository.findOne(email);

    if (!user) {
      throw new UserNotFount(`User with email <${email.value}> not found`);
    }

    return new UserResponse(user);
  }
}
