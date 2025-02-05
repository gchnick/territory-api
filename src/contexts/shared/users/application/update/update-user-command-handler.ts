import { Command } from "@/shared/domain/command";
import { CommandHandler } from "@/shared/domain/command-handler";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { RoleName } from "@/contexts/shared/users/domain/role/role-name";
import { UserEmail } from "@/contexts/shared/users/domain/user-email";
import { UserId } from "@/contexts/shared/users/domain/user-id";
import { UserPassword } from "@/contexts/shared/users/domain/user-password";

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

  async handle(command: UpdateUserCommand): Promise<void> {
    const id = new UserId(command.id);

    const {
      email: commandEmail,
      password: commandPassword,
      roles: commandRoles,
    } = command;

    const email = commandEmail ? new UserEmail(commandEmail) : undefined;
    const password = commandPassword
      ? new UserPassword(commandPassword)
      : undefined;
    const roles = commandRoles
      ? commandRoles.map(r => RoleName.fromValue(r))
      : undefined;

    await this.userUpdater.update(id, {
      email,
      password,
      roles,
    });
  }
}
