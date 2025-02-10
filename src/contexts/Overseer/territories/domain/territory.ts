import { AggregateRoot } from "@/shared/domain/aggregate-root";
import { Nullable } from "@/shared/domain/nullable";

import { CongregationId } from "@/contexts/Overseer/congregations/domain/congregation-id";
import {
  MeetingPlace,
  MeetingPlacePrimitives,
} from "@/contexts/Overseer/meeting-place/domain/meeting-place";

import { TerritoryCurrentAssigned } from "./territory-current-assigned";
import { TerritoryId } from "./territory-id";
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
  congregationId: number;
  currentAssigned: boolean;
  id: string;
  label: string;
  lastDateCompleted: Date;
  locality: string;
  localityInPart?: string;
  map?: string;
  meetingPlaces: MeetingPlacePrimitives[];
  number: number;
  quantityHouses: number;
  sector?: string;
};

export class Territory extends AggregateRoot {
  readonly id: TerritoryId;
  readonly congregation: CongregationId;
  readonly number: TerritoryNumber;
  readonly label: TerritoryLabel;
  readonly sector: Nullable<TerritorySector>;
  readonly locality: TerritoryLocality;
  readonly localityInPart: Nullable<TerritoryLocalityInPart>;
  readonly quantityHouses: TerritoryQuantityHouse;
  readonly map: Nullable<TerritoryMap>;
  readonly currentAssigned: TerritoryCurrentAssigned;
  readonly lastDateCompleted: TerritoryLastDateCompleted;
  readonly meetingPlaces: MeetingPlace[];

  constructor(
    id: TerritoryId,
    congregation: CongregationId,
    number: TerritoryNumber,
    label: TerritoryLabel,
    sector: Nullable<TerritorySector>,
    locality: TerritoryLocality,
    localityInPart: Nullable<TerritoryLocalityInPart>,
    quantityHouses: TerritoryQuantityHouse,
    map: Nullable<TerritoryMap>,
    currentAssigned: TerritoryCurrentAssigned,
    lastDateCompleted: TerritoryLastDateCompleted,
    meetingPlaces: MeetingPlace[],
  ) {
    super();
    this.id = id;
    this.congregation = congregation;
    this.number = number;
    this.label = label;
    this.sector = sector;
    this.locality = locality;
    this.localityInPart = localityInPart;
    this.quantityHouses = quantityHouses;
    this.map = map;
    this.currentAssigned = currentAssigned;
    this.lastDateCompleted = lastDateCompleted;
    this.meetingPlaces = meetingPlaces;
  }

  public assigned() {
    return new Territory(
      this.id,
      this.congregation,
      this.number,
      this.label,
      this.sector,
      this.locality,
      this.localityInPart,
      this.quantityHouses,
      this.map,
      new TerritoryCurrentAssigned(true),
      this.lastDateCompleted,
      this.meetingPlaces,
    );
  }

  public unassigned(dateClosed: Date) {
    return new Territory(
      this.id,
      this.congregation,
      this.number,
      this.label,
      this.sector,
      this.locality,
      this.localityInPart,
      this.quantityHouses,
      this.map,
      new TerritoryCurrentAssigned(false),
      new TerritoryLastDateCompleted(dateClosed),
      this.meetingPlaces,
    );
  }

  static create(
    id: TerritoryId,
    congregation: CongregationId,
    number: TerritoryNumber,
    label: TerritoryLabel,
    sector: Nullable<TerritorySector>,
    locality: TerritoryLocality,
    localityInPart: Nullable<TerritoryLocalityInPart>,
    quantityHouses: TerritoryQuantityHouse,
    map: Nullable<TerritoryMap>,
    currentAssigned: TerritoryCurrentAssigned,
    lastDateCompleted: TerritoryLastDateCompleted,
    meetingPlaces: MeetingPlace[],
  ): Territory {
    const territory = new Territory(
      id,
      congregation,
      number,
      label,
      sector,
      locality,
      localityInPart,
      quantityHouses,
      map,
      currentAssigned,
      lastDateCompleted,
      meetingPlaces,
    );

    territory.record(
      new TerritoryCreatedDomainEvent({
        aggregateId: territory.id.value,
        congregationId: territory.congregation.value,
        number: territory.number.value,
        label: territory.label.value,
      }),
    );

    return territory;
  }

  static fromPrimitives(plainData: {
    id: string;
    congregationId: number;
    number: number;
    label: string;
    sector?: string;
    locality: string;
    localityInPart?: string;
    quantityHouses: number;
    map?: string;
    currentAssigned: boolean;
    lastDateCompleted: Date;
    meetingPlaces: MeetingPlacePrimitives[];
  }): Territory {
    return new Territory(
      new TerritoryId(plainData.id),
      new CongregationId(plainData.congregationId),
      new TerritoryNumber(plainData.number),
      new TerritoryLabel(plainData.label),
      plainData.sector ? new TerritorySector(plainData.sector) : undefined,
      new TerritoryLocality(plainData.locality),
      plainData.localityInPart
        ? new TerritoryLocalityInPart(plainData.localityInPart)
        : undefined,
      new TerritoryQuantityHouse(plainData.quantityHouses),
      plainData.map ? new TerritoryMap(plainData.map) : undefined,
      new TerritoryCurrentAssigned(plainData.currentAssigned),
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
          MeetingPlace.fromPrimitives({
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
      congregationId: this.congregation.value,
      number: this.number.value,
      label: this.label.value,
      sector: this.sector?.value,
      locality: this.locality.value,
      localityInPart: this.localityInPart?.value,
      quantityHouses: this.quantityHouses.value,
      map: this.map?.value,
      currentAssigned: this.currentAssigned.value,
      lastDateCompleted: this.lastDateCompleted.value,
      meetingPlaces: this.meetingPlaces.map(m => m.toPrimitives()),
    };
  }
}
