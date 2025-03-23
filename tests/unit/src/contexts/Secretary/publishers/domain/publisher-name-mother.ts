import { faker } from "@faker-js/faker";

import { PublisherName } from "@/contexts/Secretary/publishers/domain";
import { NamePrimitives } from "@/contexts/shared/domain/name";

export const PublisherNameMother = {
  create(params?: NamePrimitives) {
    const primitives: NamePrimitives = {
      firstName: faker.person.firstName(),
      surname: faker.person.lastName(),
      middleName: faker.person.middleName(),
      ...params,
    };
    return PublisherName.fromPrimitives(primitives);
  },
};
