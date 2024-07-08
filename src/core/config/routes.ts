import { Routes } from "@nestjs/core";

import { AuthModule } from "@/app/auth/auth.module";
import { TerritoryModule } from "@/app/territories/territory.module";
import { UserModule } from "@/app/user/user.module";

export default (): Routes => [
  { path: "auth", module: AuthModule },
  { path: "users", module: UserModule },
  { path: "territories", module: TerritoryModule },
];
