import { EnviromentValueObject } from "@/contexts/shared/domain/value-object/enviroment-value-object";

export const envFilePath = (): string => {
  process.loadEnvFile();
  const nodeEnv = String(process.env.NODE_ENV);
  const environment = EnviromentValueObject.fromValue(nodeEnv);
  const production = EnviromentValueObject.production();
  const stage = EnviromentValueObject.stage();
  const test = EnviromentValueObject.test();
  const development = EnviromentValueObject.development();

  const filePath = {
    [production.value]: ".env",
    [stage.value]: ".stage.env",
    [test.value]: ".test.env",
    [development.value]: ".development.env",
  };

  const path = filePath[environment.value];

  process.loadEnvFile(path);
  return path;
};
