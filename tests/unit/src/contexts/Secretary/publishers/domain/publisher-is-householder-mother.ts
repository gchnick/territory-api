import { faker } from "@faker-js/faker";

import { PublisherIsHouseholder } from "@/contexts/Secretary/publishers/domain";

export const PublisherIsHouseholderMother = {
  create(value?: boolean) {
    return new PublisherIsHouseholder(value ?? faker.datatype.boolean(0.75));
  },
};
