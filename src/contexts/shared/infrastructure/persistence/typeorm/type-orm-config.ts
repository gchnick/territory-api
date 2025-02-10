import { DatabaseType } from "typeorm";

export type TypeOrmConfig = {
  type: DatabaseType;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};
