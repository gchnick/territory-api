import { TerritoryNumberExceeded } from "@/contexts/Overseer/territories/domain/territory-number-exceeded";
import { TerritoryNumberIsNegative } from "@/contexts/Overseer/territories/domain/territory-number-is-negative";

import { TerritoryNumberMother } from "./territory-number-mother";

describe("TerritoryNumber should", () => {
  it("throw error when value is a negative number", () => {
    const negative = -1;

    const negativeInstance = () => {
      TerritoryNumberMother.create(negative);
    };

    expect(negativeInstance).toThrow(TerritoryNumberIsNegative);
  });

  it("throw error when value greater that one hundred", () => {
    const greaterThatOneHundred = 123;

    const greaterInstance = () => {
      TerritoryNumberMother.create(greaterThatOneHundred);
    };

    expect(greaterInstance).toThrow(TerritoryNumberExceeded);
  });
});
