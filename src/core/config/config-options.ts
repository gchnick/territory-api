import { ConfigModuleOptions } from "@nestjs/config";

import { configuration } from "@/core/config/configuration";
import { validate } from "@/core/config/env.validation";

import { environmentVariables } from "./environment-variables";

const configOptions = (): ConfigModuleOptions => ({
  envFilePath: environmentVariables().path,
  isGlobal: true,
  cache: true,
  load: [configuration],
  validate,
});
export default configOptions;
