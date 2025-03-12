import { StringValueObject } from "@/shared/domain/value-object/string-value-object";

import { TerritoryMapIsEmpty } from "./territory-map-is-empty";
import { TerritoryMapLengthExceeded } from "./territory-map-length-exceeded";

export class TerritoryMap extends StringValueObject {
  static MAXIMUM_CHARACTERS = 255;

  constructor(value: string) {
    super(value);
    this.#ensureIsNotEmpty(value);
    this.#ensureLengthIsLessThanMaximumCharacters(value);
  }

  #ensureIsNotEmpty(value: string) {
    if (value.trim().length === 0) {
      throw new TerritoryMapIsEmpty(`The Territory Map is empty`);
    }
  }

  #ensureLengthIsLessThanMaximumCharacters(value: string) {
    const maximum = TerritoryMap.MAXIMUM_CHARACTERS;
    if (value.length > maximum) {
      throw new TerritoryMapLengthExceeded(
        `The Territory Map <${value}> has more than <${maximum}> characters`,
      );
    }
  }
}
