import { prisma } from '../../config/connection';
import { meetingPlaceModel } from '../../meeting-place/models/meeting-place';
import { toAvailabilityEntity } from '../../shared/models/availability';
import { NumberTerritoryAlreadyRegistry, TerritoryNotFount } from './errors';
import {
  Entity,
  PartialTerritory,
  Territory,
  TerritoryEntity,
  TerritoryEntityWithMeetingPlaces
} from './types';

class TerritoryModel {
  getAll = async () => {
    const territories = await prisma.territories.findMany({
      include: { meeting_place: { include: { availability: true } } }
    });
    return territories.map((t) => this.toModel(t));
  };

  getAvailables = async () => {
    const availablesTerritories = await prisma.territories.findMany({
      where: { assigned_lock: false },
      include: { meeting_place: { include: { availability: true } } }
    });
    return availablesTerritories.map((t) => this.toModel(t));
  };

  getByNumber = async (number: number) => {
    const territory = await prisma.territories.findUnique({
      where: { number },
      include: { meeting_place: { include: { availability: true } } }
    });

    if (territory === null)
      throw new TerritoryNotFount(
        `Territory with number: '${number}' not found`
      );

    return this.toModel(territory);
  };

  getById = async (id: string) => {
    const territory = await prisma.territories.findUnique({
      where: { id },
      include: { meeting_place: true }
    });

    if (territory === null) {
      throw new TerritoryNotFount(`Territory with id: '${id}' not found`);
    }

    return this.toModel(territory);
  };

  create = async (data: Territory) => {
    const exist = await this.#existTerritoryNumber(data.number);

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
                create: toAvailabilityEntity(m.availability)
              }
            };
          })
        }
      }
    });

    return this.toModel(newTerritory);
  };

  update = async (number: number, data: PartialTerritory) => {
    const exist = await this.#existTerritoryNumber(number);

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

    return this.toModel(updatedTerritory);
  };

  delete = async (id: string) => {
    const exist = await this.#existTerritoryId(id);

    if (exist) {
      await prisma.territories.delete({ where: { id } });
    }
  };

  async #existTerritoryNumber(number: number) {
    return (
      (await prisma.territories.findUnique({ where: { number } })) !== null
    );
  }

  async #existTerritoryId(id: string) {
    return (await prisma.territories.findUnique({ where: { id } })) !== null;
  }

  toModel(entity: Entity): Territory {
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
          meetingPlaces: entity.meeting_place.map((m) =>
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
    entity: Entity
  ): entity is TerritoryEntityWithMeetingPlaces {
    return (
      typeof (entity as TerritoryEntityWithMeetingPlaces).meeting_place !==
      'undefined'
    );
  }
}

export const territoryModel = new TerritoryModel();
