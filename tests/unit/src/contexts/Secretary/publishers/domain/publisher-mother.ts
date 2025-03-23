import type { PublisherPrimitives } from "@/contexts/Secretary/publishers/domain";

import { SexValueObjectMother } from "@/tests/unit/src/contexts/shared/domain/sex-value-object-mother";

import { Publisher } from "@/contexts/Secretary/publishers/domain";

import { PublisherAvailabilityMother } from "./publisher-availability-mother";
import { PublisherBaptismDateMother } from "./publisher-baptism-date-mother";
import { PublisherBirthDateMother } from "./publisher-birth-date-mother";
import { PublisherEmailMother } from "./publisher-email-mother";
import { PublisherHomeMother } from "./publisher-home-mother";
import { PublisherHopeMother } from "./publisher-hope-mother";
import { PublisherIdMother } from "./publisher-id-mother";
import { PublisherIsActiveMother } from "./publisher-is-active-mother";
import { PublisherIsHouseholderMother } from "./publisher-is-householder-mother";
import { PublisherIsRemovedMother } from "./publisher-is-removed-mother";
import { PublisherLastIrregularWithoutReportMother } from "./publisher-last-irregular-without-report-mother";
import { PublisherLastReportMother } from "./publisher-last-report-mother";
import { PublisherNameMother } from "./publisher-name-mother";
import { PublisherPhoneMother } from "./publisher-phone-mother";
import { PublisherPhotoMother } from "./publisher-photo-mother";
import { PublisherPrivilegeMother } from "./publisher-privilege-mother";

export const PublisherMother = {
  create(params?: Partial<PublisherPrimitives>): Publisher {
    const primitives: PublisherPrimitives = {
      availability: PublisherAvailabilityMother.createMany(4).map(
        availability => availability.toPrimitives(),
      ),
      baptismDate: PublisherBaptismDateMother.create().value,
      birthDate: PublisherBirthDateMother.create().value,
      email: PublisherEmailMother.create().value,
      home: PublisherHomeMother.create().toPrimitives(),
      hope: PublisherHopeMother.create().value,
      id: PublisherIdMother.create().value,
      isActive: PublisherIsActiveMother.create(true).value,
      isHouseholder: PublisherIsHouseholderMother.create().value,
      isRemoved: PublisherIsRemovedMother.create(false).value,
      lastIrregularWithoutReport:
        PublisherLastIrregularWithoutReportMother.create().value,
      lastReport: PublisherLastReportMother.create().value,
      name: PublisherNameMother.create().toPrimitives(),
      phones: PublisherPhoneMother.createMany(3).map(phone =>
        phone.toPrimitives(),
      ),
      photoUrl: PublisherPhotoMother.create().value,
      privileges: PublisherPrivilegeMother.createPioneerAndElder().map(
        privilege => privilege.toPrimitives(),
      ),
      sex: SexValueObjectMother.create().value,
      ...params,
    };
    return Publisher.fromPrimitives(primitives);
  },
};
