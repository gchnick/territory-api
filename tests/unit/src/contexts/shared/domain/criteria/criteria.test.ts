import assert from "node:assert";

import { faker } from "@faker-js/faker";

import { Criteria } from "@/contexts/shared/domain/criteria/criteria";
import { Filters } from "@/contexts/shared/domain/criteria/filters";
import { InvalidCriteria } from "@/contexts/shared/domain/criteria/invalid-criteria";
import { Order } from "@/contexts/shared/domain/criteria/order";

describe("Criteria", () => {
  it("should throw an error when the cursor is defined but limit isn't", () => {
    assert.throws(
      () =>
        new Criteria(
          new Filters([]),
          Order.none(),
          faker.string.uuid(),
          undefined,
        ),
      new InvalidCriteria(),
    );
  });
});
