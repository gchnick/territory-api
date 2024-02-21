import {
  Territory,
  TerritoryPrimitives,
} from "@contexts/registry/territories/domain/territory";

export class TerritoryResponse {
  public readonly data: TerritoryPrimitives;

  constructor(territory: Territory) {
    this.data = territory.toPrimitives();
  }
}
