import { UserEmail } from "@/contexts/registry/users/domain/user-email";
import { UserNotFount } from "@/contexts/registry/users/domain/user-not-fount";
import { UserRepository } from "@/contexts/registry/users/domain/user-repository";
import Logger from "@/contexts/shared/domain/logger";
import { Injectable } from "@/contexts/shared/infrastructure/dependency-injection/injectable";

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
