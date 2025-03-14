import { PhoneValueObject } from "@/contexts/shared/domain/phone-value-object";

import { PublisherPhoneHasWhatsapp } from "./phone/publisher-phone-has-whatsapp";
import { PublisherPhoneId } from "./phone/publisher-phone-id";
import { PublisherPhoneLabel } from "./phone/publisher-phone-label";

export type PublisherPhonePrimitives = {
  id: number;
  label: string;
  phone: string;
  hasWhatsapp: boolean;
};

export class PublisherPhone extends PhoneValueObject {
  readonly id: PublisherPhoneId;
  readonly label: PublisherPhoneLabel;
  readonly hasWhatsapp: PublisherPhoneHasWhatsapp;

  constructor(params: {
    value: string;
    id: PublisherPhoneId;
    label: PublisherPhoneLabel;
    hasWhatsapp: PublisherPhoneHasWhatsapp;
  }) {
    super(params.value);
    this.id = params.id;
    this.label = params.label;
    this.hasWhatsapp = params.hasWhatsapp;
  }

  static fromPrimitives(primitives: PublisherPhonePrimitives): PublisherPhone {
    return new PublisherPhone({
      value: primitives.phone,
      id: new PublisherPhoneId(primitives.id),
      label: new PublisherPhoneLabel(primitives.label),
      hasWhatsapp: new PublisherPhoneHasWhatsapp(primitives.hasWhatsapp),
    });
  }

  toPrimitives(): PublisherPhonePrimitives {
    return {
      id: this.id.value,
      phone: this.value,
      label: this.label.value,
      hasWhatsapp: this.hasWhatsapp.value,
    };
  }
}
