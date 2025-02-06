import {
  Environment,
  getNodeEnv,
} from "@/contexts/shared/domain/value-object/environment";

export const envFilePath = (): string => {
  const environment = getNodeEnv();
  const production = Environment.production();
  const stage = Environment.stage();
  const test = Environment.test();
  const development = Environment.development();

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
