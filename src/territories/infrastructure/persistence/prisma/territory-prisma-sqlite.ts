import { Nullable } from 'src/shared/domain/nullable';
import { prismaCli } from 'src/shared/infrastructure/persistence/prisma-sqlite';
import { PartialITerritory } from 'src/territories/domain/interfaces/territory.interface';
import { Territory } from 'src/territories/domain/territory';
import { TerritoryId } from 'src/territories/domain/territory-id';
import { TerritoryNumber } from 'src/territories/domain/territory-number';
import { TerritoryRepository } from 'src/territories/domain/territory-repository';
import { TerritoryPrismaMapper } from './territory-prisma.mapper';

export class TerritoryPrimaSqlite extends TerritoryRepository {
  readonly #orm = prismaCli;

  constructor() {
    super();
  }

  override async saveOrm(territory: Territory): Promise<TerritoryId> {
    const { id } = await this.#orm.territories.create({
      data: {
        number: territory.number.value,
        label: territory.label.value,
        north_limit: territory.limits.values.NORTH ?? '',
        south_limit: territory.limits.values.SOUTH ?? '',
        east_limit: territory.limits.values.EAST ?? '',
        west_limit: territory.limits.values.WEST ?? '',
        last_date_completed: territory.lastDateCompleted.value,
      },
    });

    return new TerritoryId(id);
  }

  override async searchAll(): Promise<Territory[]> {
    const territories = await this.#orm.territories.findMany({
      include: { meeting_place: { include: { availability: true } } },
    });

    return territories.map((t) => TerritoryPrismaMapper.fromEntity(t));
  }

  override async getAvailables(): Promise<Territory[]> {
    const availablesTerritories = await this.#orm.territories.findMany({
      where: { assigned_lock: false },
      include: { meeting_place: { include: { availability: true } } },
    });

    return availablesTerritories.map((t) =>
      TerritoryPrismaMapper.fromEntity(t),
    );
  }

  override async findByNumber(
    number: TerritoryNumber,
  ): Promise<Nullable<Territory>> {
    const territory = await this.#orm.territories.findUnique({
      where: { number: number.value },
      include: { meeting_place: { include: { availability: true } } },
    });

    if (territory === null) return null;

    return TerritoryPrismaMapper.fromEntity(territory);
  }

  override async findById(id: TerritoryId): Promise<Nullable<Territory>> {
    const territory = await this.#orm.territories.findUnique({
      where: { id: id.value },
      include: { meeting_place: true },
    });

    if (territory === null) return null;

    return TerritoryPrismaMapper.fromEntity(territory);
  }

  override async updateOrm(
    number: TerritoryNumber,
    data: PartialITerritory,
  ): Promise<Territory> {
    const updatedTerritory = await this.#orm.territories.update({
      where: { number: number.value },
      data: {
        ...TerritoryPrismaMapper.fromPartialITerritory(data),
      },
    });

    return TerritoryPrismaMapper.fromEntity(updatedTerritory);
  }

  override async deleteOrm(id: TerritoryId): Promise<void> {
    await this.#orm.territories.delete({ where: { id: id.value } });
  }
}
