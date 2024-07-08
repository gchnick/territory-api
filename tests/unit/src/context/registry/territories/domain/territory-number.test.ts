import { TerritoryNumberExceeded } from "@/contexts/registry/territories/domain/territory-number-exceeded";
import { TerritoryNumberIsNegative } from "@/contexts/registry/territories/domain/territory-number-is-negative";

import { TerritoryNumberMother } from "./territory-number-mother";

describe("TerritoryNumber should", () => {
  it("throw error when value is a negative number", () => {
    const negative = -1;

    const negativeInstace = () => {
      TerritoryNumberMother.create(negative);
    };

    expect(negativeInstace).toThrow(TerritoryNumberIsNegative);
  });

  it("throw error when value greater that one hundred", () => {
    const greaterThatOneHundred = 123;

    const greaterInstace = () => {
      TerritoryNumberMother.create(greaterThatOneHundred);
    };

    expect(greaterInstace).toThrow(TerritoryNumberExceeded);
  });
});
