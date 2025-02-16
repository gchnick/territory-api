import assert from "node:assert";

import { faker } from "@faker-js/faker";

import { Criteria } from "@/contexts/shared/domain/criteria/criteria";
import { Filters } from "@/contexts/shared/domain/criteria/filters";
import { Order } from "@/contexts/shared/domain/criteria/order";
import { InvalidCriteria } from "@/src/contexts/shared/domain/criteria/invalid-criteria";

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
