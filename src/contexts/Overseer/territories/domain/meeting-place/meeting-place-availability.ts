import { InvalidArgumentError } from "@/shared/domain/value-object/invalid-argument-error";

import { Available, AvailablePrimitives } from "./available";
import { Day, Days } from "./days";

export type AvailabilityPrimitives = Partial<Record<Days, AvailablePrimitives>>;

export class MeetingPlaceAvailability {
  readonly values: Map<Day, Available>;

  constructor(values: Map<Day, Available>) {
    this.values = values;
    this.#ensureDayIsUnique(values);
  }

  #ensureDayIsUnique(values: Map<Day, Available>) {
    const keys: Days[] = [];
    for (const key of values.keys()) {
      if (keys.includes(key.value)) {
        throw new InvalidArgumentError(
          `The availability value is invalid. Day <${key.value}> not is unique`,
        );
      }
      keys.push(key.value);
    }
  }

  static fromPrimitives(plainData: {
    availability: AvailabilityPrimitives;
  }): MeetingPlaceAvailability {
    const availability = new Map<Day, Available>();
    for (const key of Object.keys(plainData.availability)) {
      availability.set(
        Day.fromValue(key),
        Available.fromPrimitive({
          ...(plainData.availability[key as Days] as AvailablePrimitives),
        }),
      );
    }
    return new MeetingPlaceAvailability(availability);
  }

  toPrimitives(): AvailabilityPrimitives {
    const primitive: AvailabilityPrimitives = {};
    for (const [k, v] of this.values.entries()) {
      primitive[k.value] = v.toPrimitive();
    }
    return primitive;
  }
}
