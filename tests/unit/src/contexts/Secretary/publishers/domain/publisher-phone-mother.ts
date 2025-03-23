import { faker } from "@faker-js/faker";

import {
  PublisherPhone,
  PublisherPhonePrimitives,
} from "@/contexts/Secretary/publishers/domain";

export const PublisherPhoneMother = {
  create(params?: Partial<PublisherPhonePrimitives>) {
    const primitives: PublisherPhonePrimitives = {
      id: faker.number.int(),
      label: faker.string.sample(),
      phone: faker.phone.number(),
      hasWhatsapp: faker.datatype.boolean(0.75),
      ...params,
    };
    return PublisherPhone.fromPrimitives(primitives);
  },
  createMany(count = 3) {
    return Array.from({ length: count }, (_, index) =>
      this.create({ id: index + 1 }),
    );
  },
};
