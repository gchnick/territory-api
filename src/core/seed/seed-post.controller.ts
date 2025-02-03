import { Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { insertTerritories } from "@prisma/client/sql";

import { NestPrismaService } from "@/contexts/shared/infrastructure/persistence/prisma/nest-prisma-service";

import { territoriesSeed } from "./data-seed";

@Controller("seed")
export class SeedController {
  constructor(private readonly _repository: NestPrismaService) {}

  @Post("/run")
  @HttpCode(HttpStatus.OK)
  async run() {
    for (const {
      id,
      congregationId,
      number,
      label,
      sector,
      quantityHouses,
      locality,
      localityInPart,
      lastDateCompleted,
    } of territoriesSeed) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await this._repository.$queryRawTyped(
        insertTerritories(
          id,
          congregationId,
          number,
          label,
          sector,
          quantityHouses,
          locality,
          localityInPart,
          lastDateCompleted,
          false,
        ),
      );
    }
  }
}
