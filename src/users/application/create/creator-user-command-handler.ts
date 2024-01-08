import { Command } from '@shared/domain/command';
import { CommandHandler } from '@shared/domain/command-handler';
import { CreateUserCommand } from '@users/domain/create-user.command';
import { UserEmail } from '@users/domain/user-email';
import { UserId } from '@users/domain/user-id';
import { UserName } from '@users/domain/user-name';
import { UserPassword } from '@users/domain/user-password';
import { UserRole } from '@users/domain/user-role';
import { UserCreator } from './user-creator';

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
    const roles = command.roles.map((r) => UserRole.fromValue(r));

    await this.userCreator.run({
      id,
      name,
      email,
      password,
      roles,
    });
  }
}
