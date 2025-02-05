import { Command } from "@/shared/domain/command";
import { CommandHandler } from "@/shared/domain/command-handler";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { CreateUserCommand } from "@/contexts/shared/users/application/create/create-user.command";
import { RoleName } from "@/contexts/shared/users/domain/role/role-name";
import { UserEmail } from "@/contexts/shared/users/domain/user-email";
import { UserId } from "@/contexts/shared/users/domain/user-id";
import { UserPassword } from "@/contexts/shared/users/domain/user-password";

import { UserCreator } from "./user-creator";

@Injectable()
export class CreateUserCommandHandler
  implements CommandHandler<CreateUserCommand>
{
  constructor(private readonly userCreator: UserCreator) {}

  subscribedTo(): Command {
    return CreateUserCommand;
  }

  async handle(command: CreateUserCommand): Promise<void> {
    const id = new UserId(command.id);
    const email = new UserEmail(command.email);
    const password = new UserPassword(command.password);
    const roles = command.roles.map(r => RoleName.fromValue(r));

    await this.userCreator.create({
      id,
      email,
      password,
      roles,
    });
  }
}
