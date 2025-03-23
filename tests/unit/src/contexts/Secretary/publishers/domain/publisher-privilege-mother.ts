import { faker } from "@faker-js/faker";

import {
    Privilege,
    PublisherPrivilege,
    PublisherPrivilegePrimitives,
} from "@/contexts/Secretary/publishers/domain";

export const PublisherPrivilegeMother = {
  create(params: Partial<PublisherPrivilegePrimitives>) {
    const privilege =
      Object.values(Privilege)[
        Math.floor(Math.random() * Object.values(Privilege).length)
      ];
    const primitives: PublisherPrivilegePrimitives = {
      id: faker.number.int(),
      privilege,
      ...params,
    };
    return PublisherPrivilege.fromPrimitives(primitives);
  },
  createMany(count = 3) {
    return Array.from({ length: count }, (_, index) =>
      this.create({ id: index + 1 }),
    );
  },
  createPioneerAndElder() {
    return [
      this.create({ id: 1, privilege: Privilege.PIONEER }),
      this.create({ id: 2, privilege: Privilege.ELDER }),
    ];
  },
};
