import { Command } from "./command";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface CommandHandler<T extends Command> {
  subscribedTo(): Command;
  handle(command: T): Promise<void>;
}
