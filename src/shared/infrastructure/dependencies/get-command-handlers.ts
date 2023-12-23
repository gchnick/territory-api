import { Command } from 'src/shared/domain/command';
import { CommandHandler } from 'src/shared/domain/command-handler';
import { CommandHandlers } from '../command-bus/command-handlers';

export function getCommandHandlers(
  commandHandlers: CommandHandlers,
): Array<CommandHandler<Command>> {
  const currentHandlers = commandHandlers.values();
  const handlers: Array<CommandHandler<Command>> = [];
  for (const handler of currentHandlers) {
    handlers.push(handler);
  }
  return handlers;
}
