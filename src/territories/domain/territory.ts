import { AggregateRoot } from '@shared/domain/aggregate-root';
import { Nullable } from '@shared/domain/nullable';
import { IMeetingPlace, MeetingPlace } from './meeting-place/meeting-place';
import { TerritoryId } from './territory-id';
import { TerritoryIsLocked } from './territory-is-locked';
import { TerritoryLabel } from './territory-label';
import { TerritoryLastDateCompleted } from './territory-last-date-completed';
import { Limits, TerritoryLimits } from './territory-limits';
import { TerritoryMap } from './territory-map';
import { TerritoryNumber } from './territory-number';

export type ITerritory = {
  id?: string;
  number: number;
  label: string;
  urlMapImage?: string;
  limits: Limits;
  lastDateCompleted: Date;
  isLocked: boolean;
  meetingPlaces?: IMeetingPlace[];
};
export type PartialITerritory = Partial<ITerritory>;

export class Territory extends AggregateRoot {
  readonly id: TerritoryId;
  readonly number: TerritoryNumber;
  readonly label: TerritoryLabel;
  readonly limits: TerritoryLimits;
  readonly map: Nullable<TerritoryMap>;
  readonly isLocked: TerritoryIsLocked;
  readonly lastDateCompleted: TerritoryLastDateCompleted;
  readonly meetingPlaces: MeetingPlace[];

  constructor(
    id: TerritoryId,
    number: TerritoryNumber,
    label: TerritoryLabel,
    limits: TerritoryLimits,
    map: TerritoryMap,
    isLocked: TerritoryIsLocked,
    lastDateCompleted: TerritoryLastDateCompleted,
    meetingPlaces: MeetingPlace[],
  ) {
    super();
    this.id = id;
    this.number = number;
    this.label = label;
    this.limits = limits;
    this.map = map;
    this.isLocked = isLocked;
    this.lastDateCompleted = lastDateCompleted;
    this.meetingPlaces = meetingPlaces;
  }

  public lock() {
    return new Territory(
      this.id,
      this.number,
      this.label,
      this.limits,
      this.map,
      new TerritoryIsLocked(true),
      this.lastDateCompleted,
      this.meetingPlaces,
    );
  }

  public unlock(dateClosed: Date) {
    return new Territory(
      this.id,
      this.number,
      this.label,
      this.limits,
      this.map,
      new TerritoryIsLocked(false),
      new TerritoryLastDateCompleted(dateClosed),
      this.meetingPlaces,
    );
  }

  static create(
    id: TerritoryId,
    number: TerritoryNumber,
    label: TerritoryLabel,
    limits: TerritoryLimits,
    map: Nullable<TerritoryMap>,
    isLocked: TerritoryIsLocked,
    lastDateCompleted: TerritoryLastDateCompleted,
    meetingPlaces: MeetingPlace[],
  ): Territory {
    const territory = new Territory(
      id,
      number,
      label,
      limits,
      map,
      isLocked,
      lastDateCompleted,
      meetingPlaces,
    );

    return territory;
  }

  static fromPrimitives(plainData: {
    id: string;
    number: number;
    label: string;
    limits: {
      cardinalPoint: string;
      limit: string;
    }[];
    map: Nullable<string>;
    isLocked: boolean;
    lastDateCompleted: Date;
    meetingPlaces: {
      id: string;
      place: string;
      phone?: string;
      latitude: string;
      longitude: string;
      fieldService: boolean;
      availability?: {
        day: string;
        available: {
          frequency: string;
          moment: string;
        };
      }[];
    }[];
  }): Territory {
    return new Territory(
      new TerritoryId(plainData.id),
      new TerritoryNumber(plainData.number),
      new TerritoryLabel(plainData.label),
      TerritoryLimits.fromPrimitives(plainData.limits),
      plainData.map ? new TerritoryMap(plainData.map) : undefined,
      new TerritoryIsLocked(plainData.isLocked),
      new TerritoryLastDateCompleted(plainData.lastDateCompleted),
      plainData.meetingPlaces.map(
        ({
          id,
          place,
          phone,
          latitude,
          longitude,
          fieldService,
          availability,
        }) =>
          MeetingPlace.fromPrimitive({
            id,
            place,
            phone,
            latitude,
            longitude,
            fieldService,
            availability,
          }),
      ),
    );
  }

  toPrimitives() {
    return {
      id: this.id.value,
      number: this.number.value,
      label: this.label.value,
      limits: this.limits.toPrimitives(),
      map: this.map ? this.map.value : undefined,
      isLocked: this.isLocked.value,
      lastDateCompleted: this.lastDateCompleted.value,
      meetingPlaces: this.meetingPlaces.map((m) => m.toPrimitives()),
    };
  }
}
