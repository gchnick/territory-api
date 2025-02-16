import { EnumValueObject } from "./enum-value-object";
import { InvalidArgumentError } from "./invalid-argument-error";

export enum Environments {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TEST = "test",
  STAGE = "stage",
  NONE = "none",
}

export class Environment extends EnumValueObject<Environments> {
  constructor(value: Environments) {
    super(value, Object.values(Environments));
  }

  static fromValue(value?: string): Environment {
    if (!value) return new Environment(Environments.NONE);
    for (const environmentTypeValue of Object.values(Environments)) {
      if (value === environmentTypeValue.toString()) {
        return new Environment(environmentTypeValue);
      }
    }

    throw new InvalidArgumentError(`The environment type ${value} is invalid`);
  }

  static production() {
    return new Environment(Environments.PRODUCTION);
  }

  static stage() {
    return new Environment(Environments.STAGE);
  }

  static test() {
    return new Environment(Environments.TEST);
  }

  static development() {
    return new Environment(Environments.DEVELOPMENT);
  }

  isDevelopment() {
    return this.value === Environments.DEVELOPMENT;
  }

  isTest() {
    return this.value === Environments.TEST;
  }

  isProduction() {
    return this.value === Environments.PRODUCTION;
  }

  isStage() {
    return this.value === Environments.STAGE;
  }

  protected throwErrorForInvalidValue(value: Environments): void {
    throw new InvalidArgumentError(
      `The environment type <${value}> is invalid`,
    );
  }
}

export function getNodeEnv() {
  globalThis.process.loadEnvFile();
  const nodeEnv = globalThis.process.env.NODE_ENV;
  return Environment.fromValue(nodeEnv);
}
