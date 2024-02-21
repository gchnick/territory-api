import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  Response,
  ValidationPipe,
} from "@nestjs/common";
import { FastifyReply } from "fastify";

import { CriteriaQuery } from "@app/shared/api/request/criteria-query";

import { FindByNumberQuery } from "@contexts/registry/territories/application/find-by-number/find-by-number-query";
import { TerritoryResponse } from "@contexts/registry/territories/application/find-by-number/territory-response";
import { SearchAllTerritoryQuery } from "@contexts/registry/territories/application/search-all/search-all-territories-query";
import { TerritoriesRespose } from "@contexts/registry/territories/application/search-all/territories-response";
import { SearchTerritoriesByCriteriaQuery } from "@contexts/registry/territories/application/search-by-criteria/search-territories-by-criteria-query";
import { TerritoryNotFount } from "@contexts/registry/territories/domain/territory-not-fount";
import { FilterPrimitives } from "@contexts/shared/domain/criteria/filter";
import Logger from "@contexts/shared/domain/logger";
import { QueryBus } from "@contexts/shared/domain/query-bus";

@Controller()
export class TerritoriesGetController {
  constructor(
    private readonly log: Logger,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async search(
    @Response() reply: FastifyReply,
    @Query(new ValidationPipe({ transform: true })) queries?: CriteriaQuery,
  ) {
    try {
      if (queries) {
        const { filters, orderBy, orderType, limit, pointer } = queries;

        const query = new SearchTerritoriesByCriteriaQuery(
          this.#parseFilters(filters),
          orderBy,
          orderType,
          limit,
          pointer,
        );

        const response = await this.queryBus.ask<TerritoriesRespose>(query);
        return await reply.send(response);
      }

      const query = new SearchAllTerritoryQuery();
      const response = await this.queryBus.ask<TerritoriesRespose>(query);
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
      this.log.info(error.message);
      throw new NotFoundException(error.message);
    }
    this.log.error(error);
    throw new InternalServerErrorException("Check server logs");
  }

  #parseFilters(params: Array<FilterPrimitives>): Array<Map<string, string>> {
    if (!params) {
      return new Array<Map<string, string>>();
    }

    return params.map(filter => {
      const field = filter.field;
      const value = filter.value;
      const operator = filter.operator;

      return new Map([
        ["field", field],
        ["operator", operator],
        ["value", value],
      ]);
    });
  }
}
