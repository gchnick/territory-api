import { faker } from "@faker-js/faker";

import { PublisherIsRemoved } from "@/contexts/Secretary/publishers/domain";

export const PublisherIsRemovedMother = {
  create(value?: boolean) {
    return new PublisherIsRemoved(value ?? faker.datatype.boolean(0.75));
  },
};
