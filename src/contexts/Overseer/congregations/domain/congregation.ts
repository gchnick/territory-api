import { AggregateRoot } from "@/contexts/shared/domain/aggregate-root";
import { Nullable } from "@/contexts/shared/domain/nullable";

import { CongregationCircuit } from "./congregation-circuit";
import { CongregationId } from "./congregation-id";
import {
  CongregationLimits,
  CongregationLimitsPrimitives,
} from "./congregation-limits";
import { CongregationMap } from "./congregation-map";
import { CongregationName } from "./congregation-name";
import { CongregationNumberOfTerritories } from "./congregation-number-of-territories";

export type CongregationPrimitives = {
  number: number;
  name: string;
  circuit: string;
  numberOfTerritories: number;
  map?: Nullable<string>;
  limits: CongregationLimitsPrimitives;
};

export class Congregation extends AggregateRoot {
  readonly number: CongregationId;
  readonly name: CongregationName;
  readonly circuit: CongregationCircuit;
  readonly numberOfTerritories: CongregationNumberOfTerritories;
  readonly map: Nullable<CongregationMap>;
  readonly limits: CongregationLimits;

  constructor(
    number: CongregationId,
    name: CongregationName,
    circuit: CongregationCircuit,
    numberOfTerritories: CongregationNumberOfTerritories,
    map: Nullable<CongregationMap>,
    limits: CongregationLimits,
  ) {
    super();
    this.number = number;
    this.name = name;
    this.circuit = circuit;
    this.numberOfTerritories = numberOfTerritories;
    this.map = map;
    this.limits = limits;
  }

  static fromPrimitives(plainData: {
    number: number;
    name: string;
    circuit: string;
    numberOfTerritories: number;
    map?: Nullable<string>;
    limits: CongregationLimitsPrimitives;
  }): Congregation {
    const { map } = plainData;
    return new Congregation(
      new CongregationId(plainData.number),
      new CongregationName(plainData.name),
      new CongregationCircuit(plainData.circuit),
      new CongregationNumberOfTerritories(plainData.numberOfTerritories),
      map ? new CongregationMap(map) : undefined,
      CongregationLimits.fromPrimitives(plainData.limits),
    );
  }

  toPrimitives(): CongregationPrimitives {
    return {
      circuit: this.circuit.value,
      limits: this.limits.toPrimitives(),
      name: this.name.value,
      number: this.number.value,
      numberOfTerritories: this.numberOfTerritories.value,
      map: this.map?.value,
    };
  }
}
