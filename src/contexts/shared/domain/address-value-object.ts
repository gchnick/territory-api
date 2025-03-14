import { AddressAllArgumentsIsNotDefined } from "./address/address-all-arguments-is-not-defined";
import { AddressCityMunicipality } from "./address/address-city-municipality";
import { AddressFloorApartment } from "./address/address-floor-apartment";
import { AddressNumberPortal } from "./address/address-number-portal";
import { AddressPostalCode } from "./address/address-postal-code";
import { AddressReferencePoint } from "./address/address-reference-point";
import { AddressSector } from "./address/address-sector";
import { AddressStreetAvenue } from "./address/address-street-avenue";
import { Nullable } from "./nullable";

export type AddressPrimitives = {
  cityMunicipality?: string;
  floorApartament?: string;
  numberPortal?: string;
  postalCode?: string;
  referencePoint?: string;
  sectorAddress?: string;
  streetAvenue?: string;
};

export class AddressValueObject {
  readonly cityMunicipality: Nullable<AddressCityMunicipality>;
  readonly floorApartament: Nullable<AddressFloorApartment>;
  readonly numberPortal: Nullable<AddressNumberPortal>;
  readonly postalCode: Nullable<AddressPostalCode>;
  readonly referencePoint: Nullable<AddressReferencePoint>;
  readonly sectorAddress: Nullable<AddressSector>;
  readonly streetAvenue: Nullable<AddressStreetAvenue>;

  constructor(params: {
    cityMunicipality?: Nullable<AddressCityMunicipality>;
    floorApartament?: Nullable<AddressFloorApartment>;
    numberPortal?: Nullable<AddressNumberPortal>;
    postalCode?: Nullable<AddressPostalCode>;
    referencePoint?: Nullable<AddressReferencePoint>;
    sectorAddress?: Nullable<AddressSector>;
    streetAvenue?: Nullable<AddressStreetAvenue>;
  }) {
    this.#ensureThatOneFieldIsDefined(params);

    const {
      cityMunicipality,
      floorApartament,
      numberPortal,
      postalCode,
      referencePoint,
      sectorAddress,
      streetAvenue,
    } = params;

    this.cityMunicipality = cityMunicipality;
    this.floorApartament = floorApartament;
    this.numberPortal = numberPortal;
    this.postalCode = postalCode;
    this.referencePoint = referencePoint;
    this.sectorAddress = sectorAddress;
    this.streetAvenue = streetAvenue;
  }

  static fromPrimitives(params: AddressPrimitives): AddressValueObject {
    const {
      cityMunicipality,
      floorApartament,
      numberPortal,
      postalCode,
      referencePoint,
      sectorAddress,
      streetAvenue,
    } = params;
    return new AddressValueObject({
      cityMunicipality: cityMunicipality
        ? new AddressCityMunicipality(cityMunicipality)
        : undefined,
      floorApartament: floorApartament
        ? new AddressFloorApartment(floorApartament)
        : undefined,
      numberPortal: numberPortal
        ? new AddressNumberPortal(numberPortal)
        : undefined,
      postalCode: postalCode ? new AddressPostalCode(postalCode) : undefined,
      referencePoint: referencePoint
        ? new AddressReferencePoint(referencePoint)
        : undefined,
      sectorAddress: sectorAddress
        ? new AddressSector(sectorAddress)
        : undefined,
      streetAvenue: streetAvenue
        ? new AddressStreetAvenue(streetAvenue)
        : undefined,
    });
  }

  toPrimitives(): AddressPrimitives {
    return {
      cityMunicipality: this.cityMunicipality?.value,
      floorApartament: this.floorApartament?.value,
      numberPortal: this.numberPortal?.value,
      postalCode: this.postalCode?.value,
      referencePoint: this.referencePoint?.value,
      sectorAddress: this.sectorAddress?.value,
      streetAvenue: this.streetAvenue?.value,
    };
  }

  #ensureThatOneFieldIsDefined(params: {
    cityMunicipality?: Nullable<AddressCityMunicipality>;
    floorApartament?: Nullable<AddressFloorApartment>;
    numberPortal?: Nullable<AddressNumberPortal>;
    postalCode?: Nullable<AddressPostalCode>;
    referencePoint?: Nullable<AddressReferencePoint>;
    sectorAddress?: Nullable<AddressSector>;
    streetAvenue?: Nullable<AddressStreetAvenue>;
  }) {
    const {
      cityMunicipality,
      floorApartament,
      numberPortal,
      postalCode,
      referencePoint,
      sectorAddress,
      streetAvenue,
    } = params;

    if (
      !cityMunicipality &&
      !floorApartament &&
      !numberPortal &&
      !postalCode &&
      !referencePoint &&
      !sectorAddress &&
      !streetAvenue
    ) {
      throw new AddressAllArgumentsIsNotDefined(
        "Address must have at least one field filled. Address all arguments is not defined",
      );
    }
  }
}
