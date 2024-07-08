/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypeOrmModule } from "@nestjs/typeorm";

export const TypeOrmPostgresTestingModule = (entities: any[], url: string) =>
  TypeOrmModule.forRoot({
    type: "postgres",
    url,
    synchronize: true,
    entities: [...entities],
  });
