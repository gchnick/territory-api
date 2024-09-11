import { ExistsResponse } from "@/shared/domain/exists-response";
import Logger from "@/shared/domain/logger";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { UserId } from "../../domain/user-id";
import { UserRepository } from "../../domain/user-repository";

@Injectable()
export class UserQuestioner {
  constructor(
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
  ) {}

  async ask(id: UserId): Promise<ExistsResponse> {
    this.logger.log(`Finding if user by id <${id.value}> exists`, "Territory");
    const user = await this.userRepository.findById(id);

    return user ? new ExistsResponse(true) : new ExistsResponse(false);
  }
}
