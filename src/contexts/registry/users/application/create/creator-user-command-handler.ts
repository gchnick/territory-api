import { CreateUserCommand } from "@contexts/registry/users/domain/create-user.command";
import { UserEmail } from "@contexts/registry/users/domain/user-email";
import { UserId } from "@contexts/registry/users/domain/user-id";
import { UserName } from "@contexts/registry/users/domain/user-name";
import { UserPassword } from "@contexts/registry/users/domain/user-password";
import { UserRole } from "@contexts/registry/users/domain/user-role";
import { Command } from "@contexts/shared/domain/command";
import { CommandHandler } from "@contexts/shared/domain/command-handler";

import { UserCreator } from "./user-creator";

export class CreateUserCommandHandler
  implements CommandHandler<CreateUserCommand>
{
  constructor(private userCreator: UserCreator) {}

  subscribedTo(): Command {
    return CreateUserCommand;
  }

  async handle(command: CreateUserCommand): Promise<void> {
    const id = new UserId(command.id);
    const name = new UserName(command.name);
    const email = new UserEmail(command.email);
    const password = new UserPassword(command.password);
    const roles = command.roles.map(r => UserRole.fromValue(r));

    await this.userCreator.run({
      id,
      name,
      email,
      password,
      roles,
    });
  }
}
