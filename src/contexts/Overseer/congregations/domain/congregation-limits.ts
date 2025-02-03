import { InvalidArgumentError } from "@/shared/domain/value-object/invalid-argument-error";

import { CardinalPoint, CardinalPoints } from "./cardinal-points";
import { LimitNotFound } from "./limit-not-found";

export type Limits = Partial<Record<CardinalPoints, string>>;

export type CongregationLimitsPrimitives = {
  cardinalPoint: string;
  limit: string;
}[];

export class CongregationLimits {
  readonly values: Map<CardinalPoint, string>;

  constructor(values: Map<CardinalPoint, string>) {
    this.values = values;
    this.#ensureCardinalPointIsUnique(values);
  }

  #ensureCardinalPointIsUnique(values: Map<CardinalPoint, string>) {
    const keys: CardinalPoints[] = [];
    for (const key of values.keys()) {
      if (keys.includes(key.value)) {
        throw new InvalidArgumentError(
          `The territory limits value is invalid. Cardinal point <${key.value}> not is unique`,
        );
      }
      keys.push(key.value);
    }
  }

  get(cardinalPoint: CardinalPoint): string | undefined {
    for (const [thisCardinalPoint, thisLimit] of this.values.entries()) {
      if (cardinalPoint.equals(thisCardinalPoint)) {
        return thisLimit;
      }
    }
    return;
  }

  getOrThrow(cardinalPoint: CardinalPoint): string {
    const cardinalValue = this.get(cardinalPoint);
    if (!cardinalValue)
      throw new LimitNotFound(
        `The limit to cardinal point <${cardinalPoint.value}> is not found`,
      );

    return cardinalValue;
  }

  static fromPrimitives(
    plainData: {
      cardinalPoint: string;
      limit: string;
    }[],
  ): CongregationLimits {
    const limits = new Map<CardinalPoint, string>();
    for (const { cardinalPoint, limit } of plainData)
      limits.set(CardinalPoint.fromValue(cardinalPoint), limit);
    return new CongregationLimits(limits);
  }

  toPrimitives(): CongregationLimitsPrimitives {
    const primitive: { cardinalPoint: string; limit: string }[] = [];
    for (const [cardinalPoint, limit] of this.values.entries()) {
      primitive.push({ cardinalPoint: cardinalPoint.value, limit });
    }
    return primitive;
  }
}
