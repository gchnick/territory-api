import { PhoneNumberIsNotOnlyNumbers } from "./phone/phone-number-is-not-only-numbers";
import { StringNoEmptyWithCharacterMaximum } from "./string-no-empty-with-character-maximum";

export class PhoneValueObject extends StringNoEmptyWithCharacterMaximum {
  static PHONE_DIGITS_REQUIRED = 7;
  constructor(value: string) {
    super(value, PhoneValueObject.PHONE_DIGITS_REQUIRED);
    this.#ensureThatNumberPhoneHasOnlyNumbers(value);
    this.#ensureThatNumberPhoneHasDigitsRequired(value);
  }

  #ensureThatNumberPhoneHasOnlyNumbers(value: string) {
    if (!/^\d+$/.test(value)) {
      throw new PhoneNumberIsNotOnlyNumbers(
        "Phone Number <${value}> has characters that are not numbers",
      );
    }
  }

  #ensureThatNumberPhoneHasDigitsRequired(value: string) {
    if (value.length === PhoneValueObject.PHONE_DIGITS_REQUIRED) {
      throw new Error(
        `Phone Number <${value}> does not have ${PhoneValueObject.PHONE_DIGITS_REQUIRED} digits`,
      );
    }
  }
}
