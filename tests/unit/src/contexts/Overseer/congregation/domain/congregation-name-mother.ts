import { faker } from "@faker-js/faker";

import { CongregationName } from "@/contexts/Overseer/congregations/domain/congregation-name";

export const CongregationNameMother = {
  create(name?: string) {
    return new CongregationName(name ?? faker.location.city());
  },
};
