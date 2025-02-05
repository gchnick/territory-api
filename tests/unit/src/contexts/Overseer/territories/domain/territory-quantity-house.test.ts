import { TerritoryQuantityHouse } from "@/contexts/Overseer/territories/domain/territory-quantity-house";
import { TerritoryQuantityHouseIsInvalid } from "@/contexts/Overseer/territories/domain/territoty-quantity-house-is-invalid";

import { TerritoryQuantityHouseMother } from "./territory-quantity-house-mother";

describe("TerritoryQuantityHouse should", () => {
  it("throw error when value less that minimum houses per territory", () => {
    const lessThatMimimum =
      TerritoryQuantityHouse.MINIMUM_HOUSE_PER_TERRITORY - 1;

    const lessInstace = () => {
      TerritoryQuantityHouseMother.create(lessThatMimimum);
    };

    expect(lessInstace).toThrow(TerritoryQuantityHouseIsInvalid);
  });

  it("throw error when value greater that maximum houses per territory", () => {
    const greaterThateventyMaximum =
      TerritoryQuantityHouse.MAXIMUM_HOUSE_PER_TERRITORY + 1;

    const greaterInstace = () => {
      TerritoryQuantityHouseMother.create(greaterThateventyMaximum);
    };

    expect(greaterInstace).toThrow(TerritoryQuantityHouseIsInvalid);
  });
});
