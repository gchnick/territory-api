import { PartialITerritory } from 'src/territories/domain/interfaces/territory.interface';
import { Territory } from 'src/territories/domain/territory';
import {
  Entity as MeetingPlaceEntity,
  MeetingPlacePrismaMapper,
} from './meeting-place-prisma.mapper';

type TerritoryEntity = {
  id: string;
  number: number;
  label: string;
  north_limit: string;
  south_limit: string;
  east_limit: string;
  west_limit: string;
  last_date_completed: Date;
  url_map_image: string | null;
  assigned_lock: boolean;
};

type TerritoryEntityWithMeetingPlaces = {
  meeting_place: MeetingPlaceEntity[];
} & TerritoryEntity;

type Entity = TerritoryEntity | TerritoryEntityWithMeetingPlaces;

export class TerritoryPrismaMapper {
  static fromEntity(territory: Entity): Territory {
    return this.#checkIsTerritoryEntityWithMeetingPlaces(territory)
      ? Territory.fromPrimitives({
          id: territory.id,
          number: territory.number,
          label: territory.label,
          map: territory.url_map_image,
          lastDateCompleted: territory.last_date_completed,
          isLocked: territory.assigned_lock,
          limits: {
            NORTH: territory.north_limit,
            SOUTH: territory.south_limit,
            EAST: territory.east_limit,
            WEST: territory.west_limit,
          },
          meetingPlaces: territory.meeting_place.map((me) => {
            return MeetingPlacePrismaMapper.checkIsMeetingPlaceEntityWithAvailability(
              me,
            )
              ? {
                  id: me.id,
                  place: me.place,
                  phone: me.phone,
                  latitude: me.latitude,
                  longitude: me.longitude,
                  fieldService: me.field_service,
                  availability: MeetingPlacePrismaMapper.fromAvailabilityEntity(
                    me.availability,
                  ),
                }
              : {
                  id: me.id,
                  place: me.place,
                  phone: me.phone,
                  latitude: me.latitude,
                  longitude: me.longitude,
                  fieldService: me.field_service,
                  availability: undefined,
                };
          }),
        })
      : Territory.fromPrimitives({
          id: territory.id,
          number: territory.number,
          label: territory.label,
          map: territory.url_map_image,
          lastDateCompleted: territory.last_date_completed,
          isLocked: territory.assigned_lock,
          limits: {
            NORTH: territory.north_limit,
            SOUTH: territory.south_limit,
            EAST: territory.east_limit,
            WEST: territory.west_limit,
          },
          meetingPlaces: [],
        });
  }

  static fromPartialITerritory(
    territory: PartialITerritory,
  ): Partial<TerritoryEntity> {
    return {
      number: territory.number,
      label: territory.label,
      url_map_image: territory.urlMapImage,
      north_limit: territory.limits?.NORTH,
      south_limit: territory.limits?.SOUTH,
      east_limit: territory.limits?.EAST,
      west_limit: territory.limits?.WEST,
      last_date_completed: territory.lastDateCompleted,
      assigned_lock: territory.isLocked,
    };
  }

  /**
   * Check guard
   */
  static #checkIsTerritoryEntityWithMeetingPlaces(
    entity: Entity,
  ): entity is TerritoryEntityWithMeetingPlaces {
    return (
      typeof (entity as TerritoryEntityWithMeetingPlaces).meeting_place !==
      'undefined'
    );
  }
}
