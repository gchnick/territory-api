import { Territory, TerritoryPrimitives } from "../../domain/territory";

export class TerritoriesResponse {
  public readonly data: Array<TerritoryPrimitives>;

  constructor(territories: Array<Territory> | Territory) {
    this.data = Array.isArray(territories)
      ? territories.map(territory => territory.toPrimitives())
      : [territories.toPrimitives()];
  }
}
