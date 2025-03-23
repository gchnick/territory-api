import { StringValueObject } from "./string-value-object";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface Stringer {
  toString(): string;
}

export abstract class BaseDateValueObject<
  T extends Stringer,
> extends StringValueObject {
  readonly date: T;

  constructor(value: T) {
    super(value.toString());
    this.date = value;
  }

  protected abstract compare(other: T): number;

  isBefore(other: T): boolean {
    return this.compare(other) === -1;
  }

  isAfter(other: T): boolean {
    return this.compare(other) === 1;
  }

  isEqual(other: T): boolean {
    return this.compare(other) === 0;
  }
}
