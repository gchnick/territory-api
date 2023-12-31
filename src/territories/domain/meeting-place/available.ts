import { Moment } from './moments';

export class Available {
  readonly frequency: string;
  readonly moment: Moment;

  constructor(frequency: string, moment: Moment) {
    this.frequency = frequency;
    this.moment = moment;
  }

  static fromPrimitive(plainData: {
    frequency: string;
    moment: string;
  }): Available {
    return new Available(
      plainData.frequency,
      Moment.fromValue(plainData.moment),
    );
  }

  toPrimitive() {
    return {
      frequency: this.frequency,
      moment: this.moment.value,
    };
  }
}
