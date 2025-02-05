import { CongregationRepository } from "@/contexts/Overseer/congregations/domain/congregation-repository";
import { EnviromentValueObject } from "@/contexts/shared/domain/value-object/enviroment-value-object";
import { NestPrismaService } from "@/contexts/shared/infrastructure/persistence/prisma/nest-prisma-service";

import { CardinalPoint } from "../domain/cardinal-points";
import { Congregation } from "../domain/congregation";

export class CongregationPrisma implements CongregationRepository {
  constructor(private readonly _repository: NestPrismaService) {}

  async save(congregation: Congregation): Promise<void> {
    const {
      circuit,
      name,
      number: congregation_id,
      numberOfTerritories: number_of_territories,
      map: map_image_url,
    } = congregation.toPrimitives();

    const limits = congregation.limits;
    const east_limit = limits.getOrThrow(CardinalPoint.fromValue("EAST"));
    const north_limit = limits.getOrThrow(CardinalPoint.fromValue("NORTH"));
    const south_limit = limits.getOrThrow(CardinalPoint.fromValue("SOUTH"));
    const west_limit = limits.getOrThrow(CardinalPoint.fromValue("WEST"));

    await this._repository.congregations.create({
      data: {
        circuit,
        east_limit,
        name,
        north_limit,
        congregation_id,
        south_limit,
        west_limit,
        map_image_url,
        number_of_territories,
      },
    });
  }

  async deleteAll(): Promise<void> {
    const nodeEnv = globalThis.process.env.NODE_ENV as string;
    const enviroment = EnviromentValueObject.fromValue(nodeEnv);

    if (!enviroment.isProduction()) {
      await this._repository.congregations.deleteMany({});
    }
  }
}
