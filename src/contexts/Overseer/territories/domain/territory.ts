import { AggregateRoot } from "@/shared/domain/aggregate-root";
import { Nullable } from "@/shared/domain/nullable";

import { CongregationId } from "@/contexts/Overseer/congregations/domain/congregation-id";
import {
  MeetingPlace,
  MeetingPlacePrimitives,
} from "@/contexts/Overseer/territories/domain/meeting-place";

import { TerritoryCreatedDomainEvent } from "./territory-created-domain-event";
import { TerritoryCurrentAssigned } from "./territory-current-assigned";
import { TerritoryId } from "./territory-id";
import { TerritoryLabel } from "./territory-label";
import { TerritoryLastDateCompleted } from "./territory-last-date-completed";
import { TerritoryLocality } from "./territory-locality";
import { TerritoryMap } from "./territory-map";
import { TerritoryNumber } from "./territory-number";
import { TerritoryQuantityHouse } from "./territory-quantity-house";
import { TerritorySector } from "./territory-sector";

export type TerritoryPrimitives = {
  congregationId: number;
  currentAssigned: boolean;
  id: string;
  label: string;
  lastDateCompleted: string;
  locality: string;
  localityInPart?: string;
  map?: string;
  meetingPlaces: MeetingPlacePrimitives[];
  number: number;
  quantityHouses: number;
  sector?: string;
};

export class Territory extends AggregateRoot {
  readonly congregation: CongregationId;
  readonly currentAssigned: TerritoryCurrentAssigned;
  readonly id: TerritoryId;
  readonly label: TerritoryLabel;
  readonly lastDateCompleted: TerritoryLastDateCompleted;
  readonly locality: TerritoryLocality;
  readonly localityInPart: Nullable<TerritoryLocality>;
  readonly map: Nullable<TerritoryMap>;
  readonly meetingPlaces: MeetingPlace[];
  readonly number: TerritoryNumber;
  readonly quantityHouses: TerritoryQuantityHouse;
  readonly sector: Nullable<TerritorySector>;

  constructor(
    congregation: CongregationId,
    currentAssigned: TerritoryCurrentAssigned,
    id: TerritoryId,
    label: TerritoryLabel,
    lastDateCompleted: TerritoryLastDateCompleted,
    locality: TerritoryLocality,
    localityInPart: Nullable<TerritoryLocality>,
    map: Nullable<TerritoryMap>,
    meetingPlaces: MeetingPlace[],
    number: TerritoryNumber,
    quantityHouses: TerritoryQuantityHouse,
    sector: Nullable<TerritorySector>,
  ) {
    super();
    this.congregation = congregation;
    this.currentAssigned = currentAssigned;
    this.id = id;
    this.label = label;
    this.lastDateCompleted = lastDateCompleted;
    this.locality = locality;
    this.localityInPart = localityInPart;
    this.map = map;
    this.meetingPlaces = meetingPlaces;
    this.number = number;
    this.quantityHouses = quantityHouses;
    this.sector = sector;
  }

  public assigned() {
    return new Territory(
      this.congregation,
      new TerritoryCurrentAssigned(true),
      this.id,
      this.label,
      this.lastDateCompleted,
      this.locality,
      this.localityInPart,
      this.map,
      this.meetingPlaces,
      this.number,
      this.quantityHouses,
      this.sector,
    );
  }

  public unassigned(dateClosed: TerritoryLastDateCompleted) {
    return new Territory(
      this.congregation,
      new TerritoryCurrentAssigned(false),
      this.id,
      this.label,
      dateClosed,
      this.locality,
      this.localityInPart,
      this.map,
      this.meetingPlaces,
      this.number,
      this.quantityHouses,
      this.sector,
    );
  }

  static create(
    congregation: CongregationId,
    currentAssigned: TerritoryCurrentAssigned,
    id: TerritoryId,
    label: TerritoryLabel,
    lastDateCompleted: TerritoryLastDateCompleted,
    locality: TerritoryLocality,
    localityInPart: Nullable<TerritoryLocality>,
    map: Nullable<TerritoryMap>,
    meetingPlaces: MeetingPlace[],
    number: TerritoryNumber,
    quantityHouses: TerritoryQuantityHouse,
    sector: Nullable<TerritorySector>,
  ): Territory {
    const territory = new Territory(
      congregation,
      currentAssigned,
      id,
      label,
      lastDateCompleted,
      locality,
      localityInPart,
      map,
      meetingPlaces,
      number,
      quantityHouses,
      sector,
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
    congregationId: number;
    currentAssigned: boolean;
    id: string;
    label: string;
    lastDateCompleted: string;
    locality: string;
    localityInPart?: string;
    map?: string;
    meetingPlaces: MeetingPlacePrimitives[];
    number: number;
    quantityHouses: number;
    sector?: string;
  }): Territory {
    return new Territory(
      new CongregationId(plainData.congregationId),
      new TerritoryCurrentAssigned(plainData.currentAssigned),
      new TerritoryId(plainData.id),
      new TerritoryLabel(plainData.label),
      TerritoryLastDateCompleted.fromPrimitive(plainData.lastDateCompleted),
      new TerritoryLocality(plainData.locality),
      plainData.localityInPart
        ? new TerritoryLocality(plainData.localityInPart)
        : undefined,
      plainData.map ? new TerritoryMap(plainData.map) : undefined,
      plainData.meetingPlaces.map(({ id, address, latitude, longitude }) =>
        MeetingPlace.fromPrimitives({
          id,
          address,
          latitude,
          longitude,
        }),
      ),
      new TerritoryNumber(plainData.number),
      new TerritoryQuantityHouse(plainData.quantityHouses),
      plainData.sector ? new TerritorySector(plainData.sector) : undefined,
    );
  }

  toPrimitives(): TerritoryPrimitives {
    return {
      congregationId: this.congregation.value,
      currentAssigned: this.currentAssigned.value,
      id: this.id.value,
      label: this.label.value,
      lastDateCompleted: this.lastDateCompleted.value,
      locality: this.locality.value,
      localityInPart: this.localityInPart?.value,
      map: this.map?.value,
      meetingPlaces: this.meetingPlaces.map(m => m.toPrimitives()),
      number: this.number.value,
      quantityHouses: this.quantityHouses.value,
      sector: this.sector?.value,
    };
  }
}
