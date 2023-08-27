import { prisma } from '../../config/connection';
import { NumberTerritoryAlreadyRegistry, TerritoryNotFount } from './erros';
import { PartialTerritory, Territory, TerritoryEntity } from './territory';

export class TerritoryModel {
  static async getAll() {
    const territories = await prisma.territories.findMany();
    return territories.map((t) => this.#toModel(t));
  }

  static async getByNumber(number: number) {
    const territory = await prisma.territories.findUnique({
      where: { number }
    });

    if (territory === null)
      throw new TerritoryNotFount(
        `Territory with number: '${number}' not found`
      );

    return this.#toModel(territory);
  }

  static async create(data: Territory) {
    const exist = await TerritoryModel.#ensureExistNumber(data.number);

    if (exist) {
      throw new NumberTerritoryAlreadyRegistry(
        `Territory number '${data.number}' already registry`
      );
    }

    const newTerritory = await prisma.territories.create({
      data: {
        number: data.number,
        label: data.label,
        north_limit: data.limits.NORTH ?? '',
        south_limit: data.limits.SOUTH ?? '',
        east_limit: data.limits.EAST ?? '',
        west_limit: data.limits.WEST ?? '',
        last_date_completed: data.lastDateCompleted
      }
    });

    return this.#toModel(newTerritory);
  }

  static async update(number: number, data: PartialTerritory) {
    const updatedTerritory = await prisma.territories.update({
      where: { number },
      data: {
        ...this.#toEntity(data)
      }
    });

    return this.#toModel(updatedTerritory);
  }

  static async delete(id: string) {
    const exist = await TerritoryModel.#ensureExistId(id);
    exist && (await prisma.territories.delete({ where: { id } }));
  }

  static async #ensureExistNumber(number: number) {
    return (
      (await prisma.territories.findUnique({ where: { number } })) !== null
    );
  }

  static async #ensureExistId(id: string) {
    return (await prisma.territories.findUnique({ where: { id } })) !== null;
  }

  static #toModel(entity: TerritoryEntity): Territory {
    return {
      id: entity.id,
      number: entity.number,
      label: entity.label,
      lastDateCompleted: entity.last_date_completed,
      limits: {
        NORTH: entity.north_limit,
        SOUTH: entity.south_limit,
        EAST: entity.east_limit,
        WEST: entity.west_limit
      }
    };
  }

  static #toEntity(model: PartialTerritory): Partial<TerritoryEntity> {
    return {
      number: model.number,
      label: model.label,
      north_limit: model.limits?.NORTH,
      south_limit: model.limits?.SOUTH,
      east_limit: model.limits?.EAST,
      west_limit: model.limits?.WEST,
      last_date_completed: model.lastDateCompleted
    };
  }
}
