import { InvalidArgumentError } from '@shared/domain/value-object/invalid-argument-error';
import { Available } from './available';
import { Day, Days } from './days';
import { Moments } from './moments';

type IAvailable = {
  frequency: string;
  moment: Moments;
};

export type IAvailability = Partial<Record<Days, IAvailable>>;
export class MeetingPlaceAvailability {
  readonly values: Map<Day, Available>;

  constructor(values: Map<Day, Available>) {
    this.values = values;
    this.#ensureDayIsUnique(values);
  }

  #ensureDayIsUnique(values: Map<Day, Available>) {
    const keys = [];
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
    availability: {
      day: string;
      available: { frequency: string; moment: string };
    }[];
  }): MeetingPlaceAvailability {
    const availability = new Map<Day, Available>();
    plainData.availability.forEach((a) => {
      availability.set(
        Day.fromValue(a.day),
        Available.fromPrimitive({
          ...a.available,
        }),
      );
    });
    return new MeetingPlaceAvailability(availability);
  }

  toPrimitives() {
    const primitive: {
      day: string;
      available: {
        frequency: string;
        moment: string;
      };
    }[] = [];
    this.values.forEach((v, k) => {
      primitive.push({
        day: k.value,
        available: {
          frequency: v.frequency,
          moment: v.moment.value,
        },
      });
    });
    return primitive;
  }
}
