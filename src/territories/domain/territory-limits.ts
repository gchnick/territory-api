export enum CardinalPoint {
  NORTH = 'NORTH',
  SOUTH = 'SOUTH',
  EAST = 'EAST',
  WEST = 'WEST',
}

export type Limits = Partial<Record<CardinalPoint, string>>;

export class TerritoryLimits {
  readonly values: Limits;

  constructor(values: Limits) {
    this.values = values;
  }
}
