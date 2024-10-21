import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Request,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import * as fastify from "fastify";

import Logger from "@/shared/domain/logger";
import { QueryBus } from "@/shared/domain/query-bus";
import { SearchParamsCriteriaFiltersParser } from "@/shared/infrastructure/criteria/search-params-criteria-filters-parser";

import { FindByNumberQuery } from "@/contexts/Overseer/territories/application/find-by-number/find-by-number-query";
import { TerritoryResponse } from "@/contexts/Overseer/territories/application/find-by-number/territory-response";
import { SearchAllTerritoryQuery } from "@/contexts/Overseer/territories/application/search-all/search-all-territories-query";
import { TerritoriesResponse } from "@/contexts/Overseer/territories/application/search-all/territories-response";
import { SearchTerritoriesByCriteriaQuery } from "@/contexts/Overseer/territories/application/search-by-criteria/search-territories-by-criteria-query";
import { TerritoryNotFount } from "@/contexts/Overseer/territories/domain/territory-not-fount";

@ApiTags("Territory")
@Controller()
export class TerritoryGetController {
  constructor(
    private readonly logger: Logger,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async search(@Request() request: fastify.FastifyRequest) {
    const [, querystring] = request.url.split("?");
    const query = new URLSearchParams(querystring);
    const filters = SearchParamsCriteriaFiltersParser.parse(query);

    try {
      if (filters.length > 0) {
        const criteriaQuery = new SearchTerritoriesByCriteriaQuery(
          filters,
          query.get("orderBy") ?? undefined,
          query.get("order") ?? undefined,
          query.has("limit")
            ? Number.parseInt(query.get("limit") as string, 10)
            : undefined,
          query.get("cursor") ?? undefined,
        );

        return await this.queryBus.ask<TerritoriesResponse>(criteriaQuery);
      }

      const searchAllQuery = new SearchAllTerritoryQuery();

      return await this.queryBus.ask<TerritoriesResponse>(searchAllQuery);
    } catch (error) {
      this.#handlerError(error);
    }
  }

  @Get("/:number")
  async findByNumber(@Param("number", ParseIntPipe) number: number) {
    try {
      const query = new FindByNumberQuery(number);
      return await this.queryBus.ask<TerritoryResponse>(query);
    } catch (error) {
      this.#handlerError(error);
    }
  }

  #handlerError(error: unknown) {
    if (error instanceof TerritoryNotFount) {
      this.logger.log(error.message, "Territory");
      throw new NotFoundException(error.message);
    }
    this.logger.error("Check server logs", error);
    throw new InternalServerErrorException("Check server logs");
  }
}
