import { ConfigModuleOptions } from "@nestjs/config";

import configuration from "@/core/config/configuration";
import { envValidationSchema } from "@/core/config/env.validation";

export default (): ConfigModuleOptions => ({
  envFilePath: ".env.development",
  cache: true,
  load: [configuration],
  validationSchema: envValidationSchema,
});
