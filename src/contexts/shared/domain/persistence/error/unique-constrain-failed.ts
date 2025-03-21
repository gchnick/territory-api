import { CommandError } from "./command-error";
import { UniqueConstrainError } from "./unique-constrain-error";

export class UniqueConstrainFailed implements CommandError {
  readonly #code: string;
  readonly #message: string;

  constructor(code: string, message: string) {
    this.#code = code;
    this.#message = message;
  }

  throwPersistenceError(): void {
    throw new UniqueConstrainError(this.#code, this.#message);
  }
}
