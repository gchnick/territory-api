/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable jest/no-standalone-expect */
import { EntitySchema } from "typeorm";

import { Territory } from "@/contexts/registry/territories/domain/territory";
import { TerritoryId } from "@/contexts/registry/territories/domain/territory-id";
import { TerritoryNumber } from "@/contexts/registry/territories/domain/territory-number";
import { TerritoryRepository } from "@/contexts/registry/territories/domain/territory-repository";
import { TerritoryEntity } from "@/contexts/registry/territories/infrastructure/persistence/typeorm/territory-entity";
import { Criteria } from "@/contexts/shared/domain/criteria/criteria";
import { DeepPartial } from "@/contexts/shared/domain/deep-partial";
import { Nullable } from "@/contexts/shared/domain/nullable";

export class MockTerritoryRepository implements TerritoryRepository {
  private readonly mockSave = jest.fn();
  private readonly mockSearchAll = jest.fn();
  private readonly mockFindByNumber = jest.fn();
  private readonly mockFindById = jest.fn();
  private readonly mockUpdate = jest.fn();
  private readonly mockDelete = jest.fn();
  private readonly mockTruncate = jest.fn();
  private readonly mockMatching = jest.fn();

  protected entitySchema(): EntitySchema<Territory> {
    return TerritoryEntity;
  }

  async save(territory: Territory): Promise<void> {
    expect(this.mockSave).toHaveBeenCalledWith(territory.toPrimitives());
  }

  async searchAll(): Promise<Array<Territory>> {
    expect(this.mockSearchAll).toHaveBeenCalled();
    return this.mockSearchAll() as Promise<Array<Territory>>;
  }

  async findByNumber(number: TerritoryNumber): Promise<Nullable<Territory>> {
    expect(this.mockFindByNumber).toHaveBeenCalledWith(number);
    return this.mockFindByNumber() as Promise<Nullable<Territory>>;
  }

  async findById(id: TerritoryId): Promise<Nullable<Territory>> {
    expect(this.mockFindById).toHaveBeenCalledWith(id);
    return this.mockFindById() as Promise<Nullable<Territory>>;
  }

  async update(id: TerritoryId, data: DeepPartial<Territory>): Promise<void>;
  async update(id: TerritoryId, data: Territory): Promise<void> {
    expect(this.mockUpdate).toHaveBeenCalledWith(id, data);
    this.mockUpdate();
  }

  async delete(id: TerritoryId): Promise<void> {
    expect(this.mockDelete).toHaveBeenCalledWith(id);
  }

  async deleteAll(): Promise<void> {
    this.mockTruncate();
  }

  async matching(criteria: Criteria): Promise<Array<Territory>> {
    expect(this.mockMatching).toHaveBeenCalledWith(criteria);

    return this.mockMatching() as Promise<Array<Territory>>;
  }

  shouldSave(territory: Territory): void {
    this.mockSave(territory.toPrimitives());
  }

  shouldMatch(criteria: Criteria, territories: Array<Territory>): void {
    this.mockMatching(criteria);
    this.mockMatching.mockReturnValueOnce(territories);
  }

  shouldSearch(territory: Territory): void {
    this.mockFindByNumber(territory.number);
    this.mockFindByNumber.mockReturnValueOnce(territory);
  }

  shouldNotSearch(number: TerritoryNumber): void {
    const nullableTerritory: Nullable<Territory> = undefined;
    this.mockFindByNumber(number);
    this.mockFindByNumber.mockReturnValueOnce(nullableTerritory);
  }

  shouldSearchAll(territories: Array<Territory>): void {
    this.mockSearchAll();
    this.mockSearchAll.mockReturnValueOnce(territories);
  }

  shouldDelete(id: TerritoryId) {
    this.mockDelete(id);
  }
}
