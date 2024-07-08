import { NumberValueObject } from "@/contexts/shared/domain/value-object/number-value-object";

import { TerritoryQuantityHouseIsNegative } from "./territoty-quantity-house-is-negative";

export class TerritoryQuantityHouse extends NumberValueObject {
  constructor(value: number) {
    super(value);
    this.#ensureTerritoryQuantityHouseIsPositive(value);
  }

  #ensureTerritoryQuantityHouseIsPositive(value: number) {
    if (value < 0) {
      throw new TerritoryQuantityHouseIsNegative(
        `The Territory Quantity House <${value}> is negative`,
      );
    }
  }
}
