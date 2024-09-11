import { StringValueObject } from "@/shared/domain/value-object/string-value-object";

import { TerritoryLocalityIsEmpty } from "./territory-locality-is-empty";

export class TerritoryLocality extends StringValueObject {
  constructor(value: string) {
    super(value);

    this.#ensureIsNotEmpty(value);
  }

  #ensureIsNotEmpty(value: string) {
    if (value.trim().length === 0) {
      throw new TerritoryLocalityIsEmpty(`The Territory Locality is empty`);
    }
  }
}
