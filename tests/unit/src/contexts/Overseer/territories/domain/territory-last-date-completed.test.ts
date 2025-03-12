import { faker } from "@faker-js/faker";

import { LastDateCompletedIsInvalid } from "@/contexts/Overseer/territories/domain/last-date-completed-is-invalid";
import { TerritoryLastDateCompleted } from "@/contexts/Overseer/territories/domain/territory-last-date-completed";

describe("TerritoryLastDateCompleted should", () => {
  test("throw error when use future date", () => {
    const invalidDate = faker.date.future().toISOString().split("T")[0];

    const invalidLabelInstance = () => {
      TerritoryLastDateCompleted.fromPrimitive(invalidDate);
    };

    expect(invalidLabelInstance).toThrow(LastDateCompletedIsInvalid);
  });

  test("throw error when the structure of date is invalid", () => {
    const invalidDate = new Date().toISOString();

    const invalidLabelInstance = () => {
      TerritoryLastDateCompleted.fromPrimitive(invalidDate);
    };

    expect(invalidLabelInstance).toThrow(RangeError);
  });
});
