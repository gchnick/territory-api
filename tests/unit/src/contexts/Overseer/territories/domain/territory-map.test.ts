import { TerritoryMap } from "@/contexts/Overseer/territories/domain/territory-map";
import { TerritoryMapIsEmpty } from "@/contexts/Overseer/territories/domain/territory-map-is-empty";
import { TerritoryMapLengthExceeded } from "@/contexts/Overseer/territories/domain/territory-map-length-exceeded";

import { TerritoryMapMother } from "./territory-map-mother";

describe("TerritoryMap should", () => {
  test("throw error when map is empty", () => {
    const mapUrlEmpty = "      ";

    const labelInstance = () => {
      new TerritoryMap(mapUrlEmpty);
    };

    expect(labelInstance).toThrow(TerritoryMapIsEmpty);
  });

  test("throw error when map length exceeded the maximum characters", () => {
    const invalidMapUrl = TerritoryMapMother.invalid();

    const invalidLabelInstance = () => {
      new TerritoryMap(invalidMapUrl);
    };

    expect(invalidLabelInstance).toThrow(TerritoryMapLengthExceeded);
  });
});
