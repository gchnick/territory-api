import { ConfigModuleOptions } from "@nestjs/config";

import configuration from "@src/core/config/configuration";
import { envValidationSchema } from "@src/core/config/env.validation";

export default (): ConfigModuleOptions => ({
  cache: true,
  load: [configuration],
  validationSchema: envValidationSchema,
});
