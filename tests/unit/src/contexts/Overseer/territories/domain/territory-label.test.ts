import { TerritoryLabel } from "@/contexts/Overseer/territories/domain/territory-label";
import { TerritoryLabelIsEmpty } from "@/contexts/Overseer/territories/domain/territory-label-is-empty";
import { TerritoryLabelLengthExceeded } from "@/contexts/Overseer/territories/domain/territory-label-length-exceeded";

import { TerritoryLabelMother } from "./territory-label-mother";

describe("TerritoryLabel should", () => {
  it("throw error when label is empty", () => {
    const labelEmpty = "      ";

    const labelInstance = () => {
      new TerritoryLabel(labelEmpty);
    };

    expect(labelInstance).toThrow(TerritoryLabelIsEmpty);
  });

  it("throw error when label length exceeded the maximum characters", () => {
    const invalidLabel = TerritoryLabelMother.invalid();

    const invalidLabelInstance = () => {
      new TerritoryLabel(invalidLabel);
    };

    expect(invalidLabelInstance).toThrow(TerritoryLabelLengthExceeded);
  });
});
