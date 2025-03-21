/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewableClass } from "@/contexts/shared/domain/newable-class";

import { CommandError } from "./command-error";

type CommandErrorMappings = Record<string, NewableClass<CommandError>>;

export abstract class PersistenceHandlerError {
  #mappings: CommandErrorMappings;

  constructor(mappings: CommandErrorMappings) {
    this.#mappings = mappings;
  }

  abstract handle(error: unknown): void;

  protected throwPersistenceError(code: string, ...args: any[]) {
    const CommandErrorConstructor = this.#mappings[code];
    const argsWithCode = [code, ...args];
    const commandError = this.#transformer(CommandErrorConstructor)(
      ...argsWithCode,
    );
    commandError.throwPersistenceError();
  }

  #transformer<T extends CommandError>(
    CommandErrorConstructor: NewableClass<T>,
  ) {
    return (...args: any[]): T => new CommandErrorConstructor(...args);
  }
}
