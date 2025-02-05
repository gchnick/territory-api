import { EnumValueObject } from "@/shared/domain/value-object/enum-value-object";
import { InvalidArgumentError } from "@/shared/domain/value-object/invalid-argument-error";

export enum CardinalPoints {
  NORTH = "NORTH",
  SOUTH = "SOUTH",
  EAST = "EAST",
  WEST = "WEST",
}

export class CardinalPoint extends EnumValueObject<CardinalPoints> {
  constructor(value: CardinalPoints) {
    super(value, Object.values(CardinalPoints));
  }

  equals(other: CardinalPoint): boolean {
    return (
      other.constructor.name === this.constructor.name &&
      other.value === this.value
    );
  }

  static fromValue(value: string): CardinalPoint {
    for (const cardinalPointTypeValue of Object.values(CardinalPoints)) {
      if (value === cardinalPointTypeValue.toString()) {
        return new CardinalPoint(cardinalPointTypeValue);
      }
    }

    throw new InvalidArgumentError(
      `The CardinalPoint type <${value}> is invalid`,
    );
  }

  protected throwErrorForInvalidValue(value: CardinalPoints): void {
    throw new InvalidArgumentError(
      `The CardinalPoint type <${value}> is invalid`,
    );
  }
}
