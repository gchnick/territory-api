import { TerritoryLabel } from "@/contexts/Overseer/territories/domain/territory-label";
import { TerritoryLabelIsEmpty } from "@/contexts/Overseer/territories/domain/territory-label-is-empty";
import { TerritoryLabelLengthExceeded } from "@/contexts/Overseer/territories/domain/territory-label-length-exceeded";

import { TerritoryLabelMother } from "./territory-label-mother";

describe("TerritoryLabel should", () => {
  it("throw error when label is empty", () => {
    const labelEmpty = "      ";

    const labelInstace = () => {
      new TerritoryLabel(labelEmpty);
    };

    expect(labelInstace).toThrow(TerritoryLabelIsEmpty);
  });

  it("throw error when label lenght exceeded the maximum characters", () => {
    const invalidLabel = TerritoryLabelMother.invalid();

    const invalidLabelInstace = () => {
      new TerritoryLabel(invalidLabel);
    };

    expect(invalidLabelInstace).toThrow(TerritoryLabelLengthExceeded);
  });
});
