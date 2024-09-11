import { ConfigService } from "@nestjs/config";
import { JwtModuleAsyncOptions } from "@nestjs/jwt";

import { EnviromentVariables } from "./configuration";

const jwtAsyncOptions = (): JwtModuleAsyncOptions => ({
  inject: [ConfigService],
  useFactory: (configService: ConfigService<EnviromentVariables>) => ({
    global: true,
    secret: configService.get("JWT_SECRET"),
    signOptions: { expiresIn: "1h" },
  }),
});
export default jwtAsyncOptions;
