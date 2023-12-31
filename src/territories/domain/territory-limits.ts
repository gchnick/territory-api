import { InvalidArgumentError } from '@shared/domain/value-object/invalid-argument-error';
import { CardinalPoint, CardinalPoints } from './cardinal-points';

export type Limits = Partial<Record<CardinalPoints, string>>;

export class TerritoryLimits {
  readonly values: Map<CardinalPoint, string>;

  constructor(values: Map<CardinalPoint, string>) {
    this.values = values;
    this.#ensureCardinalPointIsUnique(values);
  }

  #ensureCardinalPointIsUnique(values: Map<CardinalPoint, string>) {
    const keys = [];
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
    this.values.forEach((v, k) => {
      if (k.value === CardinalPoints.NORTH) {
        return v;
      }
    });
    return undefined;
  }

  get south(): string {
    this.values.forEach((v, k) => {
      if (k.value === CardinalPoints.SOUTH) {
        return v;
      }
    });
    return undefined;
  }

  get east(): string {
    this.values.forEach((v, k) => {
      if (k.value === CardinalPoints.EAST) {
        return v;
      }
    });
    return undefined;
  }

  get west(): string {
    this.values.forEach((v, k) => {
      if (k.value === CardinalPoints.WEST) {
        return v;
      }
    });
    return undefined;
  }

  static fromPrimitives(
    plainData: {
      cardinalPoint: string;
      limit: string;
    }[],
  ): TerritoryLimits {
    const limits = new Map<CardinalPoint, string>();
    plainData.forEach((l) =>
      limits.set(CardinalPoint.fromValue(l.cardinalPoint), l.limit),
    );
    return new TerritoryLimits(limits);
  }

  toPrimitives() {
    const primitive: { cardinalPoint: string; limit: string }[] = [];
    this.values.forEach((v, k) => {
      primitive.push({ cardinalPoint: k.value, limit: v });
    });
    return primitive;
  }
}
