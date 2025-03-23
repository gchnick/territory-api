import { faker } from "@faker-js/faker";

import { PublisherId } from "@/contexts/Secretary/publishers/domain";

export const PublisherIdMother = {
  create(value?: string) {
    return new PublisherId(value ?? faker.string.uuid());
  },
};
