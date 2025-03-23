import { faker } from "@faker-js/faker";

import { PublisherEmail } from "@/contexts/Secretary/publishers/domain";

export const PublisherEmailMother = {
  create(value?: string) {
    return new PublisherEmail(value ?? faker.internet.email());
  },
};
