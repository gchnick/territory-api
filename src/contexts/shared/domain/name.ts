import { Nullable } from "./nullable";
import { StringValueObject } from "./value-object/string-value-object";

export type NamePrimitives = {
  firstName: string;
  surname: string;
  middleName?: string;
  fathersSurname?: string;
  mothersSurname?: string;
};

export class Name {
  readonly firstName: NameString;
  readonly surname: NameString;
  readonly middleName: Nullable<NameString>;
  readonly fathersSurname: Nullable<NameString>;
  readonly mothersSurname: Nullable<NameString>;

  constructor(params: {
    firstName: NameString;
    surname: Surname;
    middleName?: Nullable<NameString>;
    fathersSurname?: Nullable<NameString>;
    mothersSurname?: Nullable<NameString>;
  }) {
    const { firstName, surname, middleName, fathersSurname, mothersSurname } =
      params;

    this.firstName = firstName;
    this.surname = surname;
    this.middleName = middleName;
    this.fathersSurname = fathersSurname;
    this.mothersSurname = mothersSurname;
  }

  static fromPrimitives(params: {
    firstName: string;
    surname: string;
    middleName?: string;
    fathersSurname?: string;
    mothersSurname?: string;
  }): Name {
    return new Name({
      firstName: new NameString(params.firstName),
      surname: new Surname(params.surname),
      // TODO: Terminar de implementar
    });
  }

  toPrimitives(): NamePrimitives {
    return {
      firstName: this.firstName.value,
      surname: this.surname.value,
      middleName: this.middleName?.value,
      fathersSurname: this.fathersSurname?.value,
      mothersSurname: this.mothersSurname?.value,
    };
  }
}

export class NameString extends StringValueObject {}
export class Surname extends StringValueObject {}
