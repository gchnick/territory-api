import Logger from "@/shared/domain/logger";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { UserEmail } from "@/src/contexts/shared/users/domain/user-email";
import { UserNotFount } from "@/src/contexts/shared/users/domain/user-not-fount";
import { UserRepository } from "@/src/contexts/shared/users/domain/user-repository";

import { UserResponse } from "./user-response";

@Injectable()
export class UserFinder {
  constructor(
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
  ) {}

  async find(email: UserEmail) {
    this.logger.log(`Finding user by email <${email.value}>`, "User");
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFount(`User with email <${email.value}> not found`);
    }

    return new UserResponse(user);
  }
}
