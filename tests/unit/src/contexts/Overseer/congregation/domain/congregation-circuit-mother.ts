import { faker } from "@faker-js/faker";

import { CongregationCircuit } from "@/contexts/Overseer/congregations/domain/congregation-circuit";

export const CongregationCircuitMother = {
  create(circuit?: string) {
    return new CongregationCircuit(
      circuit ??
        `${faker.location.state()} ${faker.number.int({ min: 1, max: 10 })}`,
    );
  },
};
