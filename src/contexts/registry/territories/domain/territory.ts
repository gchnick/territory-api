import { AggregateRoot } from "@/contexts/shared/domain/aggregate-root";
import { Nullable } from "@/contexts/shared/domain/nullable";

import {
  MeetingPlace,
  MeetingPlacePrimitives,
} from "./meeting-place/meeting-place";
import { TerritoryId } from "./territory-id";
import { TerritoryIsLocked } from "./territory-is-locked";
import { TerritoryLabel } from "./territory-label";
import { TerritoryLastDateCompleted } from "./territory-last-date-completed";
import { TerritoryLocality } from "./territory-locality";
import { TerritoryLocalityInPart } from "./territory-locality-in-part";
import { TerritoryMap } from "./territory-map";
import { TerritoryNumber } from "./territory-number";
import { TerritoryQuantityHouse } from "./territory-quantity-house";
import { TerritorySector } from "./territory-sector";
import { TerritoryCreatedDomainEvent } from "./territoy-created-domain-event";

export type TerritoryPrimitives = {
  id: string;
  number: number;
  label: string;
  sector?: string;
  locality: string;
  localityInPart?: string;
  map?: string;
  quantityHouses: number;
  lastDateCompleted: Date;
  isLocked: boolean;
  meetingPlaces: MeetingPlacePrimitives[];
};

export class Territory extends AggregateRoot {
  readonly id: TerritoryId;
  readonly number: TerritoryNumber;
  readonly label: TerritoryLabel;
  readonly sector: Nullable<TerritorySector>;
  readonly locality: TerritoryLocality;
  readonly localityInPart: Nullable<TerritoryLocalityInPart>;
  readonly quantityHouses: TerritoryQuantityHouse;
  readonly map: Nullable<TerritoryMap>;
  readonly isLocked: TerritoryIsLocked;
  readonly lastDateCompleted: TerritoryLastDateCompleted;
  readonly meetingPlaces: MeetingPlace[];

  constructor(
    id: TerritoryId,
    number: TerritoryNumber,
    label: TerritoryLabel,
    sector: Nullable<TerritorySector>,
    locality: TerritoryLocality,
    localityInPart: Nullable<TerritoryLocalityInPart>,
    quantityHouses: TerritoryQuantityHouse,
    map: Nullable<TerritoryMap>,
    isLocked: TerritoryIsLocked,
    lastDateCompleted: TerritoryLastDateCompleted,
    meetingPlaces: MeetingPlace[],
  ) {
    super();
    this.id = id;
    this.number = number;
    this.label = label;
    this.sector = sector;
    this.locality = locality;
    this.localityInPart = localityInPart;
    this.quantityHouses = quantityHouses;
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
      this.sector,
      this.locality,
      this.localityInPart,
      this.quantityHouses,
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
      this.sector,
      this.locality,
      this.localityInPart,
      this.quantityHouses,
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
    sector: Nullable<TerritorySector>,
    locality: TerritoryLocality,
    localityInPart: Nullable<TerritoryLocalityInPart>,
    quantityHouses: TerritoryQuantityHouse,
    map: Nullable<TerritoryMap>,
    isLocked: TerritoryIsLocked,
    lastDateCompleted: TerritoryLastDateCompleted,
    meetingPlaces: MeetingPlace[],
  ): Territory {
    const territory = new Territory(
      id,
      number,
      label,
      sector,
      locality,
      localityInPart,
      quantityHouses,
      map,
      isLocked,
      lastDateCompleted,
      meetingPlaces,
    );

    territory.record(
      new TerritoryCreatedDomainEvent({
        aggregateId: territory.id.value,
        number: territory.number.value,
        label: territory.label.value,
      }),
    );

    return territory;
  }

  static fromPrimitives(plainData: {
    id: string;
    number: number;
    label: string;
    sector?: string;
    locality: string;
    localityInPart?: string;
    quantityHouses: number;
    map?: string;
    isLocked: boolean;
    lastDateCompleted: Date;
    meetingPlaces: MeetingPlacePrimitives[];
  }): Territory {
    return new Territory(
      new TerritoryId(plainData.id),
      new TerritoryNumber(plainData.number),
      new TerritoryLabel(plainData.label),
      plainData.sector ? new TerritorySector(plainData.sector) : undefined,
      new TerritoryLocality(plainData.locality),
      plainData.localityInPart
        ? new TerritoryLocalityInPart(plainData.localityInPart)
        : undefined,
      new TerritoryQuantityHouse(plainData.quantityHouses),
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

  toPrimitives(): TerritoryPrimitives {
    return {
      id: this.id.value,
      number: this.number.value,
      label: this.label.value,
      sector: this.sector?.value,
      locality: this.locality.value,
      localityInPart: this.localityInPart?.value,
      quantityHouses: this.quantityHouses.value,
      map: this.map?.value,
      isLocked: this.isLocked.value,
      lastDateCompleted: this.lastDateCompleted.value,
      meetingPlaces: this.meetingPlaces?.map(m => m.toPrimitives()), // TODO: Implement meeting places
    };
  }
}
