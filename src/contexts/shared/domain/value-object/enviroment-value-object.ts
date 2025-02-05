import { EnumValueObject } from "./enum-value-object";
import { InvalidArgumentError } from "./invalid-argument-error";

export enum Enviroment {
  DEVELOPENT = "development",
  PRODUCTION = "production",
  TEST = "test",
  STAGE = "stage",
}

export class EnviromentValueObject extends EnumValueObject<Enviroment> {
  constructor(value: Enviroment) {
    super(value, Object.values(Enviroment));
  }

  static fromValue(value: string): EnviromentValueObject {
    for (const enviromentTypeValue of Object.values(Enviroment)) {
      if (value === enviromentTypeValue.toString()) {
        return new EnviromentValueObject(enviromentTypeValue);
      }
    }

    throw new InvalidArgumentError(`The environment type ${value} is invalid`);
  }

  static production() {
    return new EnviromentValueObject(Enviroment.PRODUCTION);
  }

  static stage() {
    return new EnviromentValueObject(Enviroment.STAGE);
  }

  static test() {
    return new EnviromentValueObject(Enviroment.TEST);
  }

  static development() {
    return new EnviromentValueObject(Enviroment.DEVELOPENT);
  }

  isDevelopment() {
    return this.value === Enviroment.DEVELOPENT;
  }

  isTest() {
    return this.value === Enviroment.TEST;
  }

  isProduction() {
    return this.value === Enviroment.PRODUCTION;
  }

  isStage() {
    return this.value === Enviroment.STAGE;
  }

  protected throwErrorForInvalidValue(value: Enviroment): void {
    throw new InvalidArgumentError(
      `The environment type <${value}> is invalid`,
    );
  }
}
