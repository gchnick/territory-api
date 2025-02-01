import { faker } from "@faker-js/faker";

import { FindByNumberQuery } from "@/contexts/Overseer/territories/application/find-by-number/find-by-number-query";

export const FindByNumberQueryMother = {
  create(number?: number): FindByNumberQuery {
    return new FindByNumberQuery(
      number ?? faker.number.int({ min: 1, max: 100 }),
    );
  },
};
