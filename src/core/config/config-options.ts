import { ConfigModuleOptions } from "@nestjs/config";

import configuration from "@/core/config/configuration";
import { validate } from "@/core/config/env.validation";

import { envFilePath } from "./env-file-path";

const configOptions = (): ConfigModuleOptions => ({
  envFilePath: envFilePath(),
  isGlobal: true,
  cache: true,
  load: [configuration],
  validate,
});
export default configOptions;
