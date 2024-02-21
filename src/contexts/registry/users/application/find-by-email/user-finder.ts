import { UserEmail } from "@contexts/registry/users/domain/user-email";
import { UserNotFount } from "@contexts/registry/users/domain/user-not-fount";
import { UserRepository } from "@contexts/registry/users/domain/user-repository";
import Logger from "@contexts/shared/domain/logger";

import { UserResponse } from "./user-response";

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
