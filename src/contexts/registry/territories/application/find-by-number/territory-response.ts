import { Territory, TerritoryPrimitives } from "../../domain/territory";

export class TerritoryResponse {
  public readonly data: TerritoryPrimitives;

  constructor(territory: Territory) {
    this.data = territory.toPrimitives();
  }
}
