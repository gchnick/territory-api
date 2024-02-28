/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSource, Repository } from "typeorm";

import { Criteria } from "@contexts/shared/domain/criteria/criteria";
import Logger from "@contexts/shared/domain/logger";
import { Nullable } from "@contexts/shared/domain/nullable";

import { Territory, TerritoryPrimitives } from "../../../domain/territory";
import { TerritoryId } from "../../../domain/territory-id";
import { TerritoryNumber } from "../../../domain/territory-number";
import { TerritoryRepository } from "../../../domain/territory-repository";
import { Territory as TerritoryEntity } from "./territory.entity";

export class TerritoryTypeorm extends TerritoryRepository {
  readonly #repository: Repository<TerritoryEntity>;

  constructor(
    private readonly log: Logger,
    private readonly dataSource: DataSource,
  ) {
    super();
    this.#repository = this.dataSource.getRepository(TerritoryEntity);
  }

  async save(territory: Territory): Promise<void> {
    try {
      const newTerritory = this.#repository.create({
        id: territory.id.value,
        number: territory.number.value,
        label: territory.label.value,
        // locality: TODO: Feature to implemente
        // sector: TODO: Feature to implemente
        // localityInPart: TODO: Feature to implemente
        // quantityHouse: TODO: Feature to implemente
        lastDateCompleted: territory.lastDateCompleted.value,
        assignedLock: territory.isLocked.value,
        urlMapImage: territory.map?.value,
      });

      await this.#repository.save(newTerritory);
    } catch (error) {
      this.log.error(error);
      throw new Error("TODO: Implement error");
    }
  }

  async searchAll(): Promise<Territory[]> {
    const territoriesEntity = await this.#repository.find();
    return territoriesEntity.map(
      ({
        id,
        number,
        label,
        sector,
        locality,
        localityInPart,
        quantityHouse,
        assignedLock,
        lastDateCompleted,
        urlMapImage,
      }) =>
        Territory.fromPrimitives({
          id,
          label,
          number,
          limits: [], // FIXME: Remove
          lastDateCompleted,
          isLocked: assignedLock,
          map: urlMapImage,
          meetingPlaces: [], // TODO: Implement
        }),
    );
  }

  async matching(criteria: Criteria): Promise<Territory[]> {
    throw new Error("Method not implemented.");
  }

  async findByNumber(_number: TerritoryNumber): Promise<Nullable<Territory>> {
    const territory = await this.#repository.findOneBy({
      number: _number.value,
    });

    if (!territory) {
      return;
    }

    const {
      id,
      label,
      number,
      sector,
      locality,
      localityInPart,
      quantityHouse,
      assignedLock,
      lastDateCompleted,
      urlMapImage,
    } = territory;

    return Territory.fromPrimitives({
      id,
      label,
      number,
      limits: [], // FIXME: Remove
      // locality: TODO: Feature to implemente
      // sector: TODO: Feature to implemente
      // localityInPart: TODO: Feature to implemente
      // quantityHouse: TODO: Feature to implemente
      lastDateCompleted,
      isLocked: assignedLock,
      map: urlMapImage,
      meetingPlaces: [], // TODO: Implement
    });
  }

  async findById(_id: TerritoryId): Promise<Nullable<Territory>> {
    const territory = await this.#repository.findOneBy({
      id: _id.value,
    });

    if (!territory) {
      return;
    }

    const {
      id,
      label,
      number,
      sector,
      locality,
      localityInPart,
      quantityHouse,
      assignedLock,
      lastDateCompleted,
      urlMapImage,
    } = territory;

    return Territory.fromPrimitives({
      id,
      label,
      number,
      limits: [], // FIXME: Remove
      // locality: TODO: Feature to implemente
      // sector: TODO: Feature to implemente
      // localityInPart: TODO: Feature to implemente
      // quantityHouse: TODO: Feature to implemente
      lastDateCompleted,
      isLocked: assignedLock,
      map: urlMapImage,
      meetingPlaces: [], // TODO: Implement
    });
  }

  async update(
    number: TerritoryNumber,
    data: Partial<TerritoryPrimitives>,
  ): Promise<Territory> {
    throw new Error("Method not implemented.");
  }

  async delete(id: TerritoryId): Promise<void> {
    await this.#repository
      .createQueryBuilder()
      .delete()
      .where("id = :id", { id: id.value })
      .execute();
  }

  protected async truncate(): Promise<void> {
    await this.#repository.clear();
  }
}
