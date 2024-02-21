import { InvalidArgumentError } from "@contexts/shared/domain/value-object/invalid-argument-error";

import { CardinalPoint, CardinalPoints } from "./cardinal-points";

export type Limits = Partial<Record<CardinalPoints, string>>;

export type TerritoryLimitsPrimitives = {
  cardinalPoint: string;
  limit: string;
}[];

export class TerritoryLimits {
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
          `The territory limits value is invalid. ardinal point <${key.value}> not is unique`,
        );
      }
      keys.push(key.value);
    }
  }

  get north(): string {
    for (const [k, v] of this.values.entries()) {
      if (k.isNorth()) {
        return v;
      }
    }
    return "";
  }

  get south(): string {
    for (const [k, v] of this.values.entries()) {
      if (k.isSouth()) {
        return v;
      }
    }
    return "";
  }

  get east(): string {
    for (const [k, v] of this.values.entries()) {
      if (k.isEast()) {
        return v;
      }
    }
    return "";
  }

  get west(): string {
    for (const [k, v] of this.values.entries()) {
      if (k.isWest()) {
        return v;
      }
    }
    return "";
  }

  static fromPrimitives(
    plainData: {
      cardinalPoint: string;
      limit: string;
    }[],
  ): TerritoryLimits {
    const limits = new Map<CardinalPoint, string>();
    for (const l of plainData)
      limits.set(CardinalPoint.fromValue(l.cardinalPoint), l.limit);
    return new TerritoryLimits(limits);
  }

  toPrimitives(): TerritoryLimitsPrimitives {
    const primitive: { cardinalPoint: string; limit: string }[] = [];
    for (const [k, v] of this.values.entries()) {
      primitive.push({ cardinalPoint: k.value, limit: v });
    }
    return primitive;
  }
}
