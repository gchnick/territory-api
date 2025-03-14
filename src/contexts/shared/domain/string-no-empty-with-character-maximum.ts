import { StringIsEmpty } from "./string-is-empty";
import { StringLengthExceeded } from "./string-length-exceeded";
import { StringValueObject } from "./value-object/string-value-object";

export class StringNoEmptyWithCharacterMaximum extends StringValueObject {
  constructor(
    value: string,
    private readonly MAXIMUM_CHARACTERS = 255,
  ) {
    super(value);
    this.#ensureIsNotEmpty(value);
    this.#ensureLengthIsLessThanMaximumCharacters(value);
  }

  #ensureIsNotEmpty(value: string) {
    if (value.trim().length === 0) {
      throw new StringIsEmpty(`The value is empty`);
    }
  }

  #ensureLengthIsLessThanMaximumCharacters(value: string) {
    const maximum = this.MAXIMUM_CHARACTERS;
    if (value.length > maximum) {
      throw new StringLengthExceeded(
        `The value <${value}> has more than <${maximum}> characters`,
      );
    }
  }
}
