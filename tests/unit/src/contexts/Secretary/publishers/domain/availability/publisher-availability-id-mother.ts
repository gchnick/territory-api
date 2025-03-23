import { faker } from "@faker-js/faker";

import { PublisherAvailabilityId } from "@/contexts/Secretary/publishers/domain";

export const PublisherAvailabilityIdMother = {
  create(value?: number) {
    return new PublisherAvailabilityId(value ?? faker.number.int());
  },
};
