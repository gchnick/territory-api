import type { AddressPrimitives } from "@/contexts/shared/domain/address-value-object";
import type { NamePrimitives } from "@/contexts/shared/domain/name";
import type { PublisherAvailabilityPrimitives } from "./publisher-availability";
import type { Hope } from "./publisher-hope";
import type { PublisherPhonePrimitives } from "./publisher-phone";
import type { PublisherPrivilegePrimitives } from "./publisher-privilege";

import { AggregateRoot } from "@/contexts/shared/domain/aggregate-root";
import { Nullable } from "@/contexts/shared/domain/nullable";
import { Sex, SexValueObject } from "@/contexts/shared/domain/sex-value-object";

import { PublisherAvailability } from "./publisher-availability";
import { PublisherBaptismDate } from "./publisher-baptism-date";
import { PublisherBirthDate } from "./publisher-birth-date";
import { PublisherEmail } from "./publisher-email";
import { PublisherHome } from "./publisher-home";
import { PublisherHope } from "./publisher-hope";
import { PublisherId } from "./publisher-id";
import { PublisherIsActive } from "./publisher-is-active";
import { PublisherIsHouseholder } from "./publisher-is-householder";
import { PublisherIsRemoved } from "./publisher-is-removed";
import { PublisherLastIrregularWithoutReport } from "./publisher-last-irregular-without-report";
import { PublisherLastReport } from "./publisher-last-report";
import { PublisherName } from "./publisher-name";
import { PublisherPhone } from "./publisher-phone";
import { PublisherPhoto } from "./publisher-photo";
import { PublisherPrivilege } from "./publisher-privilege";

export type PublisherPrimitives = {
  availability?: PublisherAvailabilityPrimitives[];
  baptismDate?: string;
  birthDate: string;
  email?: string;
  home?: AddressPrimitives;
  hope: Hope;
  id: string;
  isActive: boolean;
  isHouseholder: boolean;
  isRemoved: boolean;
  lastIrregularWithoutReport?: string;
  lastReport?: string;
  name: NamePrimitives;
  phones?: PublisherPhonePrimitives[];
  photoUrl?: string;
  privileges?: PublisherPrivilegePrimitives[];
  sex: Sex;
};

export class Publisher extends AggregateRoot {
  readonly availability: Nullable<PublisherAvailability[]>;
  readonly baptismDate: Nullable<PublisherBaptismDate>;
  readonly birthDate: PublisherBirthDate;
  readonly email: Nullable<PublisherEmail>;
  readonly home: Nullable<PublisherHome>;
  readonly hope: PublisherHope;
  readonly id: PublisherId;
  readonly isActive: PublisherIsActive;
  readonly isHouseholder: PublisherIsHouseholder;
  readonly isRemoved: PublisherIsRemoved;
  readonly lastIrregularWithoutReport: Nullable<PublisherLastIrregularWithoutReport>;
  readonly lastReport: Nullable<PublisherLastReport>;
  readonly name: PublisherName;
  readonly phones: Nullable<PublisherPhone[]>;
  readonly photoUrl: Nullable<PublisherPhoto>;
  readonly privileges: Nullable<PublisherPrivilege[]>;
  readonly sex: SexValueObject;

  constructor(params: {
    availability?: Nullable<PublisherAvailability[]>;
    baptismDate?: Nullable<PublisherBaptismDate>;
    birthDate: PublisherBirthDate;
    email?: Nullable<PublisherEmail>;
    home?: Nullable<PublisherHome>;
    hope: PublisherHope;
    id: PublisherId;
    isActive: PublisherIsActive;
    isHouseholder: PublisherIsHouseholder;
    isRemoved: PublisherIsRemoved;
    lastIrregularWithoutReport?: Nullable<PublisherLastIrregularWithoutReport>;
    lastReport?: Nullable<PublisherLastReport>;
    name: PublisherName;
    phones?: Nullable<PublisherPhone[]>;
    photoUrl: Nullable<PublisherPhoto>;
    privileges?: Nullable<PublisherPrivilege[]>;
    sex: SexValueObject;
  }) {
    super();

    const {
      availability,
      baptismDate,
      birthDate,
      email,
      home,
      hope,
      id,
      isActive,
      isHouseholder,
      isRemoved,
      lastIrregularWithoutReport,
      lastReport,
      name,
      phones,
      photoUrl,
      privileges,
      sex,
    } = params;

    this.availability = availability;
    this.baptismDate = baptismDate;
    this.birthDate = birthDate;
    this.email = email;
    this.home = home;
    this.hope = hope;
    this.id = id;
    this.isActive = isActive;
    this.isHouseholder = isHouseholder;
    this.isRemoved = isRemoved;
    this.lastIrregularWithoutReport = lastIrregularWithoutReport;
    this.lastReport = lastReport;
    this.name = name;
    this.phones = phones;
    this.photoUrl = photoUrl;
    this.privileges = privileges;
    this.sex = sex;
  }

  static fromPrimitives(params: PublisherPrimitives): Publisher {
    const {
      availability,
      baptismDate,
      email,
      home,
      lastIrregularWithoutReport,
      lastReport,
      phones,
      photoUrl,
      privileges,
      sex,
    } = params;
    return new Publisher({
      availability: availability?.map(a =>
        PublisherAvailability.fromPrimitives(a),
      ),
      baptismDate: baptismDate
        ? PublisherBaptismDate.fromValue(baptismDate)
        : undefined,
      birthDate: PublisherBirthDate.fromValue(params.birthDate),
      email: email ? new PublisherEmail(email) : undefined,
      home: home ? PublisherHome.fromPrimitives(home) : undefined,
      hope: PublisherHope.fromValue(params.hope),
      id: new PublisherId(params.id),
      isActive: new PublisherIsActive(params.isActive),
      isHouseholder: new PublisherIsHouseholder(params.isHouseholder),
      isRemoved: new PublisherIsRemoved(params.isRemoved),
      lastIrregularWithoutReport: lastIrregularWithoutReport
        ? PublisherLastIrregularWithoutReport.fromValue(
            lastIrregularWithoutReport,
          )
        : undefined,
      lastReport: lastReport
        ? PublisherLastReport.fromValue(lastReport)
        : undefined,
      name: PublisherName.fromPrimitives(params.name),
      phones: phones?.map(phone => PublisherPhone.fromPrimitives(phone)),
      photoUrl: photoUrl ? new PublisherPhoto(photoUrl) : undefined,
      privileges: privileges?.map(privilege =>
        PublisherPrivilege.fromPrimitives(privilege),
      ),
      sex: SexValueObject.fromValue(sex),
    });
  }

  toPrimitives(): PublisherPrimitives {
    return {
      availability: this.availability?.map(a => a.toPrimitives()),
      baptismDate: this.baptismDate?.value,
      birthDate: this.birthDate.value,
      email: this.email?.value,
      home: this.home?.toPrimitives(),
      hope: this.hope.value,
      id: this.id.value,
      isActive: this.isActive.value,
      isHouseholder: this.isHouseholder.value,
      isRemoved: this.isRemoved.value,
      lastIrregularWithoutReport: this.lastIrregularWithoutReport?.value,
      lastReport: this.lastReport?.value,
      name: this.name.toPrimitives(),
      phones: this.phones?.map(phone => phone.toPrimitives()),
      photoUrl: this.photoUrl?.value,
      privileges: this.privileges?.map(privilege => privilege.toPrimitives()),
      sex: this.sex.value,
    };
  }
}
