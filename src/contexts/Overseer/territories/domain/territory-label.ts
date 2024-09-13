import { StringValueObject } from "@/shared/domain/value-object/string-value-object";

import { TerritoryLabelIsEmpty } from "./territory-label-is-empty";
import { TerritoryLabelLengthExceeded } from "./territory-label-length-exceeded";

export class TerritoryLabel extends StringValueObject {
  static MAXIMUM_CHARACTERS = 50;

  constructor(value: string) {
    super(value);
    this.#ensureIsNotEmpty(value);
    this.#ensureLengthIsLessThanMaximumCharacters(value);
  }

  #ensureIsNotEmpty(value: string) {
    if (value.trim().length === 0) {
      throw new TerritoryLabelIsEmpty(`The Territory Name is empty`);
    }
  }

  #ensureLengthIsLessThanMaximumCharacters(value: string) {
    const maximum = TerritoryLabel.MAXIMUM_CHARACTERS;
    if (value.length > maximum) {
      throw new TerritoryLabelLengthExceeded(
        `The Territory Name <${value}> has more than <${maximum}> characters`,
      );
    }
  }
}
