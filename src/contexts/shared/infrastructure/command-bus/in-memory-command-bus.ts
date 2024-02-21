import { Command } from "@contexts/shared/domain/command";
import { CommandBus } from "@contexts/shared/domain/command-bus";

import { CommandHandlers } from "./command-handlers";

export class InMemoryCommandBus implements CommandBus {
  constructor(private commandHandlers: CommandHandlers) {}

  async dispatch(command: Command): Promise<void> {
    const handler = this.commandHandlers.get(command);

    await handler.handle(command);
  }
}
