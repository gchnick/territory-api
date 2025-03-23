import { faker } from "@faker-js/faker";

import { PublisherHome } from "@/contexts/Secretary/publishers/domain";
import { AddressPrimitives } from "@/contexts/shared/domain/address-value-object";

export const PublisherHomeMother = {
  create(params?: Partial<AddressPrimitives>) {
    const primitives: AddressPrimitives = {
      streetAvenue: faker.location.streetAddress(),
      cityMunicipality: faker.location.city(),
      sectorAddress: faker.location.secondaryAddress(),
      postalCode: faker.location.zipCode({ format: "####" }),
      referencePoint: faker.location.direction(),
      numberPortal: faker.location.buildingNumber(),
      ...params,
    };
    return PublisherHome.fromPrimitives(primitives);
  },
};
