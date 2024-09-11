import { Routes } from "@nestjs/core";

import { AuthModule } from "@/src/app/shared/auth/auth.module";
import { TerritoryModule } from "@/src/app/overseer/territories/territory.module";
import { UserModule } from "@/src/app/shared/user/user.module";

const routes = (): Routes => [
  { path: "auth", module: AuthModule },
  { path: "users", module: UserModule },
  { path: "territories", module: TerritoryModule },
];
export default routes;
