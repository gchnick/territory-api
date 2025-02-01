import { Nullable } from "@/contexts/shared/domain/nullable";

import { CongregationCircuit } from "./congregation-circuit";
import { CongregationId } from "./congregation-id";
import { CongregationLimits } from "./congregation-limits";
import { CongregationMap } from "./congregation-map";
import { CongregationName } from "./congregation-name";
import { CongregationNumberOfTerritories } from "./congregation-number-of-territories";

export type CongregationPrimitives = {
  number: number;
  name: string;
  circuit: string;
  numberOfTerritories: Nullable<number>;
  map: Nullable<string>;
  limits: unknown;
};

export class Congregation {
  readonly number: CongregationId;
  readonly name: CongregationName;
  readonly circuit: CongregationCircuit;
  readonly numberOfTerritories: Nullable<CongregationNumberOfTerritories>;
  readonly map: Nullable<CongregationMap>;
  readonly limits: CongregationLimits;

  constructor(
    number: CongregationId,
    name: CongregationName,
    circuit: CongregationCircuit,
    numberOfTerritories: Nullable<CongregationNumberOfTerritories>,
    map: Nullable<CongregationMap>,
    limits: CongregationLimits,
  ) {
    this.number = number;
    this.name = name;
    this.circuit = circuit;
    this.numberOfTerritories = numberOfTerritories;
    this.map = map;
    this.limits = limits;
  }
}
