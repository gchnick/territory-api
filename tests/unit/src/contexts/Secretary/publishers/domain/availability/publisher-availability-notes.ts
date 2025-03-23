import { faker } from "@faker-js/faker";

import { PublisherAvailabilityNotes } from "@/contexts/Secretary/publishers/domain";

export const PublisherAvailabilityNotesMother = {
  create(value?: string): PublisherAvailabilityNotes {
    return new PublisherAvailabilityNotes(value ?? faker.lorem.sentence());
  },
};
