import { TerritoryLocality } from "@/contexts/Overseer/territories/domain/territory-locality";
import { TerritoryLocalityIsEmpty } from "@/contexts/Overseer/territories/domain/territory-locality-is-empty";
import { TerritoryLocalityLengthExceeded } from "@/contexts/Overseer/territories/domain/territory-locality-length-exceeded";

import { TerritoryLocalityMother } from "./territory-locality-mother";

describe("TerritoryLocality should", () => {
  it("throw error when locality is empty", () => {
    const localityEmpty = "      ";

    const labelInstance = () => {
      new TerritoryLocality(localityEmpty);
    };

    expect(labelInstance).toThrow(TerritoryLocalityIsEmpty);
  });

  it("throw error when locality length exceeded the maximum characters", () => {
    const invalidLocality = TerritoryLocalityMother.invalid();

    const invalidLabelInstance = () => {
      new TerritoryLocality(invalidLocality);
    };

    expect(invalidLabelInstance).toThrow(TerritoryLocalityLengthExceeded);
  });
});
