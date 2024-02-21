import { Routes } from "@nestjs/core";

import { AuthModule } from "@app/auth/auth.module";
import { TerritoryModule } from "@app/territories/territory.module";

export default (): Routes => [
  { path: "auth", module: AuthModule },
  { path: "territories", module: TerritoryModule },
];
