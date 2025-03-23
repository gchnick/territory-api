import { faker } from "@faker-js/faker";

import { PublisherPhoto } from "@/contexts/Secretary/publishers/domain";

export const PublisherPhotoMother = {
  create(value?: string) {
    return new PublisherPhoto(value ?? faker.image.url());
  },
};
