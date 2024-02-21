import { DatabaseType } from "typeorm";

export interface TypeOrmConfig {
  type: DatabaseType;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}
