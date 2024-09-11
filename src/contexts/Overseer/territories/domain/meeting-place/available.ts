import { Moment, Moments } from "./moments";

export type AvailablePrimitives = {
  frequency: string;
  moment: Moments;
};

export class Available {
  readonly frequency: string;
  readonly moment: Moment;

  constructor(frequency: string, moment: Moment) {
    this.frequency = frequency;
    this.moment = moment;
  }

  static fromPrimitive(plainData: AvailablePrimitives): Available {
    return new Available(
      plainData.frequency,
      Moment.fromValue(plainData.moment),
    );
  }

  toPrimitive(): AvailablePrimitives {
    return {
      frequency: this.frequency,
      moment: this.moment.value,
    };
  }
}
