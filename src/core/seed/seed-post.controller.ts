import { Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { insertTerritories } from "@/db/client/external/sql";

import { NestExternalPrismaService } from "@/contexts/shared/infrastructure/persistence/prisma/services/nest-external-prisma.service";

import { territoriesSeed } from "./data-seed";

@Controller("seed")
export class SeedController {
  constructor(private readonly _repository: NestExternalPrismaService) {}

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
