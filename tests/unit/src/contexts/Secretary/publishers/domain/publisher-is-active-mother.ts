import { faker } from "@faker-js/faker";

import { PublisherIsActive } from "@/contexts/Secretary/publishers/domain";

export const PublisherIsActiveMother = {
  create(value?: boolean) {
    return new PublisherIsActive(value ?? faker.datatype.boolean(0.75));
  },
};
