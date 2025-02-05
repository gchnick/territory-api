import { faker } from "@faker-js/faker";

import { CongregationId } from "@/contexts/Overseer/congregations/domain/congregation-id";

export const CongregationIdMother = {
  create(value?: number): CongregationId {
    return new CongregationId(
      value ?? faker.number.int({ min: 10_000, max: 99_999 }),
    );
  },
};
