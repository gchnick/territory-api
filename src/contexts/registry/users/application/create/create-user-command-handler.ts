import { CreateUserCommand } from "@/contexts/registry/users/application/create/create-user.command";
import { UserEmail } from "@/contexts/registry/users/domain/user-email";
import { UserId } from "@/contexts/registry/users/domain/user-id";
import { UserName } from "@/contexts/registry/users/domain/user-name";
import { UserPassword } from "@/contexts/registry/users/domain/user-password";
import { Command } from "@/contexts/shared/domain/command";
import { CommandHandler } from "@/contexts/shared/domain/command-handler";
import { Injectable } from "@/contexts/shared/infrastructure/dependency-injection/injectable";

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
