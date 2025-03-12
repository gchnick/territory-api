import { TerritoryQuantityHouse } from "@/contexts/Overseer/territories/domain/territory-quantity-house";
import { TerritoryQuantityHouseIsInvalid } from "@/contexts/Overseer/territories/domain/territory-quantity-house-is-invalid";

import { TerritoryQuantityHouseMother } from "./territory-quantity-house-mother";

describe("TerritoryQuantityHouse should", () => {
  it("throw error when value less that minimum houses per territory", () => {
    const lessThatMinimum =
      TerritoryQuantityHouse.MINIMUM_HOUSE_PER_TERRITORY - 1;

    const lessInstance = () => {
      TerritoryQuantityHouseMother.create(lessThatMinimum);
    };

    expect(lessInstance).toThrow(TerritoryQuantityHouseIsInvalid);
  });

  it("throw error when value greater that maximum houses per territory", () => {
    const greaterThateventyMaximum =
      TerritoryQuantityHouse.MAXIMUM_HOUSE_PER_TERRITORY + 1;

    const greaterInstance = () => {
      TerritoryQuantityHouseMother.create(greaterThateventyMaximum);
    };

    expect(greaterInstance).toThrow(TerritoryQuantityHouseIsInvalid);
  });
});
