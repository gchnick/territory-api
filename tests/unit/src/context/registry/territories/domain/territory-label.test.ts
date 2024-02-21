import { TerritoryLabel } from "@contexts/registry/territories/domain/territory-label";
import { TerritoryLabelIsEmpty } from "@contexts/registry/territories/domain/territory-label-is-empty";
import { TerritoryLabelLengthExceeded } from "@contexts/registry/territories/domain/territory-label-length-exceeded";

describe("TerritoryLabel should", () => {
  it("throw error when label is empty", () => {
    const labelEmpty = "      ";

    const labelInstace = () => {
      new TerritoryLabel(labelEmpty);
    };

    expect(labelInstace).toThrow(TerritoryLabelIsEmpty);
  });

  it("throw error when label lenght exceeded 100 characters", () => {
    const label =
      "This is a label length exceeded 50 characters. This value is invalid";

    const labelInstace = () => {
      new TerritoryLabel(label);
    };

    expect(labelInstace).toThrow(TerritoryLabelLengthExceeded);
  });
});
