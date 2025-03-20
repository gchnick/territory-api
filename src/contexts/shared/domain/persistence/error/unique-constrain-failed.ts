import { CommandError } from "./comand-error";
import { UniqueContrainError } from "./unique-contrain-error";

export class UniqueConstrainFailed implements CommandError {
  readonly #code: string;
  readonly #message: string;

  constructor(code: string, message: string) {
    this.#code = code;
    this.#message = message;
  }

  throwPersistenceError(): void {
    throw new UniqueContrainError(this.#code, this.#message);
  }
}
