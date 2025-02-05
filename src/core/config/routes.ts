import { Routes } from "@nestjs/core";

import { TerritoryModule } from "@/app/overseer/territories/territory.module";
import { AuthModule } from "@/app/shared/auth/auth.module";
import { UserModule } from "@/app/shared/user/user.module";

const routes = (): Routes => [
  { path: "auth", module: AuthModule },
  { path: "users", module: UserModule },
  { path: "territories", module: TerritoryModule },
];
export default routes;
