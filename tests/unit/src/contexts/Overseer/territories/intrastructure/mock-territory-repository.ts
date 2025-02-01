/* eslint-disable @typescript-eslint/require-await */
import { Criteria } from "@/shared/domain/criteria/criteria";
import { Nullable } from "@/shared/domain/nullable";

import { Territory } from "@/contexts/Overseer/territories/domain/territory";
import { TerritoryId } from "@/contexts/Overseer/territories/domain/territory-id";
import { TerritoryNumber } from "@/contexts/Overseer/territories/domain/territory-number";
import {
  PartialTerritoryPrimitives,
  TerritoryRepository,
} from "@/contexts/Overseer/territories/domain/territory-repository";

export class MockTerritoryRepository implements TerritoryRepository {
  private readonly mockSave = vi.fn();
  private readonly mockSearchAll = vi.fn();
  private readonly mockFindByNumber = vi.fn();
  private readonly mockFindById = vi.fn();
  private readonly mockUpdate = vi.fn();
  private readonly mockDelete = vi.fn();
  private readonly mockTruncate = vi.fn();
  private readonly mockMatching = vi.fn();

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

  async update(
    id: TerritoryId,
    data: PartialTerritoryPrimitives,
  ): Promise<void> {
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
