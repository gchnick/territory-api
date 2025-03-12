import { StringValueObject } from "@/shared/domain/value-object/string-value-object";

import { TerritoryLocalityIsEmpty } from "./territory-locality-is-empty";
import { TerritoryLocalityLengthExceeded } from "./territory-locality-length-exceeded";

export class TerritoryLocality extends StringValueObject {
  static MAXIMUM_CHARACTERS = 255;

  constructor(value: string) {
    super(value);
    this.#ensureIsNotEmpty(value);
    this.#ensureLengthIsLessThanMaximumCharacters(value);
  }

  #ensureIsNotEmpty(value: string) {
    if (value.trim().length === 0) {
      throw new TerritoryLocalityIsEmpty(`The Territory Locality is empty`);
    }
  }

  #ensureLengthIsLessThanMaximumCharacters(value: string) {
    const maximum = TerritoryLocality.MAXIMUM_CHARACTERS;
    if (value.length > maximum) {
      throw new TerritoryLocalityLengthExceeded(
        `The Territory Label <${value}> has more than <${maximum}> characters`,
      );
    }
  }
}
