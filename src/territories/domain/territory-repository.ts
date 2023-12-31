import { Nullable } from '@shared/domain/nullable';
import { PartialITerritory, Territory } from './territory';
import { TerritoryId } from './territory-id';
import { TerritoryNotFount } from './territory-not-fount';
import { TerritoryNumber } from './territory-number';

export abstract class TerritoryRepository {
  abstract save(territory: Territory): Promise<TerritoryId | never>;

  abstract searchAll(): Promise<Array<Territory>>;

  abstract getAvailables(): Promise<Array<Territory>>;

  abstract findByNumber(number: TerritoryNumber): Promise<Nullable<Territory>>;

  abstract findById(id: TerritoryId): Promise<Nullable<Territory>>;

  async update(
    number: TerritoryNumber,
    territory: PartialITerritory,
  ): Promise<Territory> {
    const exist = await this.#existTerritoryNumber(number);
    if (!exist) {
      throw new TerritoryNotFount(
        `Territory number <${number.value}> not found`,
      );
    }

    return await this.updateOrm(number, territory);
  }

  async delete(id: TerritoryId): Promise<void> {
    const exist = await this.#existTerritoryId(id);
    if (exist) {
      await this.deleteOrm(id);
    }
  }

  protected abstract updateOrm(
    number: TerritoryNumber,
    data: PartialITerritory,
  ): Promise<Territory>;

  async deleteAll(): Promise<void> {
    const NODE_ENV = process.env.NODE_ENV;
    if (NODE_ENV === 'development' || NODE_ENV === 'test') {
      await this.deleteAllOrm();
    }
  }

  protected abstract deleteOrm(id: TerritoryId): Promise<void>;

  protected abstract deleteAllOrm(): Promise<void>;

  async #existTerritoryNumber(number: TerritoryNumber) {
    return (await this.findByNumber(number)) !== null;
  }

  async #existTerritoryId(id: TerritoryId) {
    return (await this.findById(id)) !== null;
  }
}
