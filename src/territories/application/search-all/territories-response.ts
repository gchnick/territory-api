import { Territory } from 'src/territories/domain/territory';
import { ITerritoryResponse } from '../find-by-number/territory-response';

export class TerritoriesRespose {
  public readonly territories: Array<ITerritoryResponse>;

  constructor(territories: Array<Territory>) {
    this.territories = territories.map((territory) => territory.toPrimitives());
  }
}
