import { Command } from "@/contexts/shared/domain/command";
import { CommandHandler } from "@/contexts/shared/domain/command-handler";
import { Injectable } from "@/contexts/shared/infrastructure/dependency-injection/injectable";

import { UpdateUserCommand } from "./update-user-command";
import { UserUpdater } from "./user-updater";

@Injectable()
export class UpdateUserCommandHandler
  implements CommandHandler<UpdateUserCommand>
{
  constructor(private readonly userUpdater: UserUpdater) {}

  subscribedTo(): Command {
    return UpdateUserCommand;
  }

  /** TODO: Method not implemented */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
  async handle(_command: UpdateUserCommand): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
