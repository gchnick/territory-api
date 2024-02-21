import {
  Territory,
  TerritoryPrimitives,
} from "@contexts/registry/territories/domain/territory";

export class TerritoriesRespose {
  public readonly data: Array<TerritoryPrimitives>;

  constructor(territories: Array<Territory>) {
    this.data = territories.map(territory => territory.toPrimitives());
  }
}
