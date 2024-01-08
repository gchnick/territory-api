import { ConfigModuleOptions } from '@nestjs/config';
import configuration from '@shared/infrastructure/nest/configuration';
import { envValidationSchema } from '@shared/infrastructure/nest/env.validation';

export default (): ConfigModuleOptions => ({
  cache: true,
  load: [configuration],
  validationSchema: envValidationSchema,
});
