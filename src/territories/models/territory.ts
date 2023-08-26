import { prisma } from '../../config/connection';

export enum CardinalPoint {
  NORTH = 'NORTH',
  SOUTH = 'SOUTH',
  EAST = 'EAST',
  WEST = 'WEST'
}

type Limits = Partial<Record<CardinalPoint, string>>;

export type Territory = {
  number: number;
  label: string;
  limits: Limits;
  lastDateCompleted: Date;
};

export type PartialTerritory = Partial<Territory>;

export class TerritoryModel {
  static async getAll() {
    const territories = await prisma.territories.findMany();
    return territories;
  }

  static async getByNumber(number: number) {
    const territory = await prisma.territories.findUnique({
      where: { number }
    });
    return territory;
  }

  static async create(input: Territory) {
    const exist = await TerritoryModel.#ensureExistNumber(input.number);

    if (exist) {
      throw Error('Territory number already exist');
    }

    const newTerritory = await prisma.territories.create({
      data: {
        number: input.number,
        label: input.label,
        north_limit: input.limits.NORTH ?? '',
        south_limit: input.limits.SOUTH ?? '',
        east_limit: input.limits.EAST ?? '',
        west_limit: input.limits.WEST ?? '',
        last_date_completed: input.lastDateCompleted
      }
    });

    return newTerritory;
  }

  static async update(number: number, input: PartialTerritory) {
    const data = {
      number: input.number,
      label: input.label,
      north_limit: input.limits?.NORTH,
      south_limit: input.limits?.SOUTH,
      east_limit: input.limits?.EAST,
      west_limit: input.limits?.WEST,
      last_date_completed: input.lastDateCompleted
    };
    return await prisma.territories.update({
      where: { number },
      data: {
        ...data
      }
    });
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
}
