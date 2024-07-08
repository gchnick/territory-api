import { StringValueObject } from "@/contexts/shared/domain/value-object/string-value-object";

import { TerritorySectorIsEmpty } from "./territory-sector-is-empty";
import { TerritorySectorLengthExceeded } from "./territory-sector-length-exceeded";

export class TerritorySector extends StringValueObject {
  constructor(value: string) {
    super(value);

    this.#ensureIsNotEmpty(value);
    this.#ensureLengthIsLessThan50Characters(value);
  }

  #ensureIsNotEmpty(value: string) {
    if (value.trim().length === 0) {
      throw new TerritorySectorIsEmpty(`The Territory Sector is empty`);
    }
  }

  #ensureLengthIsLessThan50Characters(value: string) {
    if (value.length > 50) {
      throw new TerritorySectorLengthExceeded(
        `The Territory Sector <${value}> has more than 50 characters`,
      );
    }
  }
}
