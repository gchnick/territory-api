import { NumberValueObject } from "@/shared/domain/value-object/number-value-object";

import { TerritoryQuantityHouseIsInvalid } from "./territoty-quantity-house-is-invalid";

export class TerritoryQuantityHouse extends NumberValueObject {
  static MINIMUM_HOUSE_PER_TERRITORY = 50;
  static MAXIMUM_HOUSE_PER_TERRITORY = 75;

  constructor(value: number) {
    super(value);
    this.#ensureTerritoryQuantityHouseGreaterThatFortyNice(value);
  }

  #ensureTerritoryQuantityHouseGreaterThatFortyNice(value: number) {
    if (
      value < TerritoryQuantityHouse.MINIMUM_HOUSE_PER_TERRITORY ||
      value > TerritoryQuantityHouse.MAXIMUM_HOUSE_PER_TERRITORY
    ) {
      throw new TerritoryQuantityHouseIsInvalid(
        `The Territory Quantity House <${value}> is less that fifty`,
      );
    }
  }
}
