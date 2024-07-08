import { Command } from "@/contexts/shared/domain/command";
import { CommandHandler } from "@/contexts/shared/domain/command-handler";
import { CommandNotRegisteredError } from "@/contexts/shared/domain/command-not-registered-error";

export class CommandHandlers extends Map<Command, CommandHandler<Command>> {
  constructor(commandHandlers: Array<CommandHandler<Command>>) {
    super();

    for (const commandHandler of commandHandlers) {
      this.set(commandHandler.subscribedTo(), commandHandler);
    }
  }

  public get(command: Command): CommandHandler<Command> {
    const commandHandler = super.get(command.constructor);

    if (!commandHandler) {
      throw new CommandNotRegisteredError(command);
    }

    return commandHandler;
  }
}
