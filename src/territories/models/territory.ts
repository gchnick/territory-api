import { prisma } from '../../config/connection';
import { getAvailableCreateQuery } from '../../shared/models/availability';
import { NumberTerritoryAlreadyRegistry, TerritoryNotFount } from './errors';
import { meetingPlaceModel } from './meeting-place';
import {
  Entity,
  PartialTerritory,
  Territory,
  TerritoryEntity,
  TerritoryEntityWithMeetingPlaces
} from './types';

class TerritoryModel {
  async getAll() {
    const territories = await prisma.territories.findMany();
    return territories.map((t) => this.#toModel(t));
  }

  async getByNumber(number: number) {
    const territory = await prisma.territories.findUnique({
      where: { number },
      include: { meeting_place: true }
    });

    if (territory === null)
      throw new TerritoryNotFount(
        `Territory with number: '${number}' not found`
      );

    return this.#toModel(territory);
  }

  async getById(id: string) {
    const territory = await prisma.territories.findUnique({
      where: { id }
    });

    if (territory === null) {
      throw new TerritoryNotFount(`Territory with id: '${id}' not found`);
    }

    return this.#toModel(territory);
  }

  async create(data: Territory) {
    const exist = await this.#ensureExistNumber(data.number);

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
        last_date_completed: data.lastDateCompleted,
        meeting_place: {
          create: data.meetingPlaces?.map((m) => {
            return {
              place: m.place,
              phone: m.phone,
              field_service: m.fieldService,
              latitude: m.latitude,
              longitude: m.longitude,
              availability: {
                create: getAvailableCreateQuery(m.availavility)
              }
            };
          })
        }
      }
    });

    return this.#toModel(newTerritory);
  }

  async update(number: number, data: PartialTerritory) {
    const exist = await this.#ensureExistNumber(number);

    if (!exist) {
      throw new TerritoryNotFount(
        `Territory number '${data.number}' not found`
      );
    }

    const updatedTerritory = await prisma.territories.update({
      where: { number },
      data: {
        ...this.#toEntity(data)
      }
    });

    return this.#toModel(updatedTerritory);
  }

  async delete(id: string) {
    const exist = await this.#ensureExistId(id);

    if (exist) {
      await prisma.territories.delete({ where: { id } });
    }
  }

  async #ensureExistNumber(number: number) {
    return (
      (await prisma.territories.findUnique({ where: { number } })) !== null
    );
  }

  async #ensureExistId(id: string) {
    return (await prisma.territories.findUnique({ where: { id } })) !== null;
  }

  #toModel(entity: Entity): Territory {
    return this.#checkIsTerritoryEntityWithMeetingPlaces(entity)
      ? {
          id: entity.id,
          number: entity.number,
          label: entity.label,
          urlMapImage: entity.url_map_image ?? undefined,
          lastDateCompleted: entity.last_date_completed,
          isLocked: entity.assigned_lock,
          limits: {
            NORTH: entity.north_limit,
            SOUTH: entity.south_limit,
            EAST: entity.east_limit,
            WEST: entity.west_limit
          },
          meetingPlaces: entity.meeting_places.map((m) =>
            meetingPlaceModel.toModel(m)
          )
        }
      : {
          id: entity.id,
          number: entity.number,
          label: entity.label,
          urlMapImage: entity.url_map_image ?? undefined,
          lastDateCompleted: entity.last_date_completed,
          isLocked: entity.assigned_lock,
          limits: {
            NORTH: entity.north_limit,
            SOUTH: entity.south_limit,
            EAST: entity.east_limit,
            WEST: entity.west_limit
          }
        };
  }

  #toEntity(model: PartialTerritory): Partial<TerritoryEntity> {
    return {
      number: model.number,
      label: model.label,
      url_map_image: model.urlMapImage,
      north_limit: model.limits?.NORTH,
      south_limit: model.limits?.SOUTH,
      east_limit: model.limits?.EAST,
      west_limit: model.limits?.WEST,
      last_date_completed: model.lastDateCompleted,
      assigned_lock: model.isLocked
    };
  }

  /**
   * Check guard
   */
  #checkIsTerritoryEntityWithMeetingPlaces(
    entity: TerritoryEntity
  ): entity is TerritoryEntityWithMeetingPlaces {
    return (
      typeof (entity as TerritoryEntityWithMeetingPlaces).meeting_places !==
      'undefined'
    );
  }
}

export const territoryModel = new TerritoryModel();
