import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Request,
  Response,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FastifyReply, FastifyRequest } from "fastify";

import { FindByNumberQuery } from "@/contexts/registry/territories/application/find-by-number/find-by-number-query";
import { TerritoryResponse } from "@/contexts/registry/territories/application/find-by-number/territory-response";
import { SearchAllTerritoryQuery } from "@/contexts/registry/territories/application/search-all/search-all-territories-query";
import { TerritoriesResponse } from "@/contexts/registry/territories/application/search-all/territories-response";
import { SearchTerritoriesByCriteriaQuery } from "@/contexts/registry/territories/application/search-by-criteria/search-territories-by-criteria-query";
import { TerritoryNotFount } from "@/contexts/registry/territories/domain/territory-not-fount";
import Logger from "@/contexts/shared/domain/logger";
import { QueryBus } from "@/contexts/shared/domain/query-bus";
import { SearchParamsCriteriaFiltersParser } from "@/contexts/shared/infrastructure/criteria/search-params-criteria-filters-parser";

@ApiTags("Territory")
@Controller()
export class TerritoryGetController {
  constructor(
    private readonly logger: Logger,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async search(
    @Request() request: FastifyRequest,
    @Response() reply: FastifyReply,
  ) {
    const { searchParams } = new URL(request.url, "http://dymmy");
    const filters = SearchParamsCriteriaFiltersParser.parse(searchParams);

    try {
      if (filters.length > 0) {
        const criteriaQuery = new SearchTerritoriesByCriteriaQuery(
          filters,
          searchParams.get("orderBy") ?? undefined,
          searchParams.get("order") ?? undefined,
          searchParams.has("limit")
            ? Number.parseInt(searchParams.get("limit") as string, 10)
            : undefined,
          searchParams.get("cursor") ?? undefined,
        );

        const response =
          await this.queryBus.ask<TerritoriesResponse>(criteriaQuery);
        return await reply.send(response);
      }

      const searchAllQuery = new SearchAllTerritoryQuery();
      const response =
        await this.queryBus.ask<TerritoriesResponse>(searchAllQuery);
      await reply.send(response);
    } catch (error) {
      this.#handlerError(error);
    }
  }

  @Get("/:number")
  async findByNumber(
    @Response() reply: FastifyReply,
    @Param("number", ParseIntPipe) number: number,
  ) {
    try {
      const query = new FindByNumberQuery(number);
      const response = await this.queryBus.ask<TerritoryResponse>(query);
      await reply.send(response);
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
