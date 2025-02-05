import { AvailableDay, Days } from "./available-days";
import { AvailableFrecuency } from "./available-frecuency";
import { AvailableMoment, Moments } from "./available-moments";

export type AvailablePrimitives = {
  day: Days;
  frequency: string;
  moment: Moments;
};

export class Available {
  readonly day: AvailableDay;
  readonly frequency: AvailableFrecuency;
  readonly moment: AvailableMoment;

  constructor(
    day: AvailableDay,
    frequency: AvailableFrecuency,
    moment: AvailableMoment,
  ) {
    this.day = day;
    this.frequency = frequency;
    this.moment = moment;
  }

  static fromPrimitive(plainData: AvailablePrimitives): Available {
    return new Available(
      new AvailableDay(plainData.day),
      new AvailableFrecuency(plainData.frequency),
      AvailableMoment.fromValue(plainData.moment),
    );
  }

  toPrimitive(): AvailablePrimitives {
    return {
      day: this.day.value,
      frequency: this.frequency.value,
      moment: this.moment.value,
    };
  }
}
