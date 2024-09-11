import { Command } from "@/shared/domain/command";
import { CommandHandler } from "@/shared/domain/command-handler";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { CreateUserCommand } from "@/src/contexts/shared/users/application/create/create-user.command";
import { UserEmail } from "@/src/contexts/shared/users/domain/user-email";
import { UserId } from "@/src/contexts/shared/users/domain/user-id";
import { UserName } from "@/src/contexts/shared/users/domain/user-name";
import { UserPassword } from "@/src/contexts/shared/users/domain/user-password";

import { RoleName } from "../../domain/role/role-name";
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
    const name = new UserName(command.name);
    const email = new UserEmail(command.email);
    const password = new UserPassword(command.password);
    const roles = command.roles.map(r => RoleName.fromValue(r));

    await this.userCreator.create({
      id,
      name,
      email,
      password,
      roles,
    });
  }
}
