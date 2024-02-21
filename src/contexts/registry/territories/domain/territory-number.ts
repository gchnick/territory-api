import { NumberValueObject } from "@contexts/shared/domain/value-object/number-value-object";

import { TerritoryNumberExceeded } from "./territory-number-exceeded";
import { TerritoryNumberIsNegative } from "./territory-number-is-negative";

export class TerritoryNumber extends NumberValueObject {
  constructor(value: number) {
    super(value);
    this.#ensureTerritoryNumberIsLessThanOrEqualToOneHundred(value);
  }

  #ensureTerritoryNumberIsLessThanOrEqualToOneHundred(value: number) {
    if (value > 100) {
      throw new TerritoryNumberExceeded(
        `The Territory Number <${value}> is mayor that 100`,
      );
    }
    if (value < 0) {
      throw new TerritoryNumberIsNegative(
        `The Territory Number <${value}> is negative`,
      );
    }
  }
}
