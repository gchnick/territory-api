import { StringValueObject } from "@/shared/domain/value-object/string-value-object";

import { TerritoryLocalityInPartIsEmpty } from "./territory-locality-in-part-is-empty";

export class TerritoryLocalityInPart extends StringValueObject {
  constructor(value: string) {
    super(value);

    this.#ensureIsNotEmpty(value);
  }

  #ensureIsNotEmpty(value: string) {
    if (value.trim().length === 0) {
      throw new TerritoryLocalityInPartIsEmpty(
        `The Territory Locality In Part is empty`,
      );
    }
  }
}
