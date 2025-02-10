import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import * as fastify from "fastify";

import { Roles } from "@/app/shared/auth/decorators/roles.decorator";
import { AuthGuard } from "@/app/shared/auth/guards/auth.guard";
import { RolesGuard } from "@/app/shared/auth/guards/roles.guard";

import Logger from "@/shared/domain/logger";
import { QueryBus } from "@/shared/domain/query-bus";

import { FindByNumberQuery } from "@/contexts/Overseer/territories/application/find-by-number/find-by-number-query";
import { TerritoryResponse } from "@/contexts/Overseer/territories/application/find-by-number/territory-response";
import { SearchAllTerritoryQuery } from "@/contexts/Overseer/territories/application/search-all/search-all-territories-query";
import { TerritoriesResponse } from "@/contexts/Overseer/territories/application/search-all/territories-response";
import { SearchTerritoriesByCriteriaQuery } from "@/contexts/Overseer/territories/application/search-by-criteria/search-territories-by-criteria-query";
import { TerritoryNotFount } from "@/contexts/Overseer/territories/domain/territory-not-fount";
import { CriteriaFromFastifyRequestConverter } from "@/contexts/shared/infrastructure/criteria/criteria-from-fastify-request-converter";
import { Role } from "@/contexts/shared/users/domain/role/role-name";

@ApiTags("Territory")
@ApiBearerAuth()
@ApiForbiddenResponse({
  description: "Forbidden. Restricted access",
})
@ApiUnauthorizedResponse({ description: "Unauthorized. Credentials invalid" })
@ApiInternalServerErrorResponse({
  description: "Contact your administrator",
})
@Controller()
export class TerritoryGetController {
  constructor(
    private readonly logger: Logger,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiOperation({
    summary:
      "Obtain a list with all territories or search for territories according to filters. (Only for elders and territory servants)",
    description:
      "This endpoint only has access for the rol OVERSEER or TERRITORY_SERVANT",
  })
  @ApiOkResponse({
    description: "Territories were found",
    type: TerritoriesResponse,
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.OVERSEER, Role.TERRITORY_SERVANT)
  @Get()
  async search(@Request() request: fastify.FastifyRequest) {
    const converter = new CriteriaFromFastifyRequestConverter();
    const criteria = converter.toCriteria(request);

    try {
      if (criteria.hasFilters()) {
        const criteriaQuery = new SearchTerritoriesByCriteriaQuery(criteria);
        return this.queryBus.ask<TerritoriesResponse>(criteriaQuery);
      }

      const searchAllQuery = new SearchAllTerritoryQuery();

      return this.queryBus.ask<TerritoriesResponse>(searchAllQuery);
    } catch (error) {
      this.#handlerError(error);
    }
  }

  @ApiOperation({
    summary:
      "Obtain territory information by congregation and number. (Only for elders and territory servants)",
    description:
      "This endpoint only has access for the rol OVERSEER or TERRITORY_SERVANT",
  })
  @ApiOkResponse({
    description: "Territory were found",
    type: TerritoryResponse,
  })
  @ApiParam({
    name: "congregationNumber",
    description: "Congregation number",
    type: Number,
    required: true,
  })
  @ApiParam({
    name: "number",
    description: "Territory number",
    type: Number,
    required: true,
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.OVERSEER, Role.TERRITORY_SERVANT)
  @Get("/:congregationNumber/:number")
  async findByNumber(
    @Param("congregationNumber", ParseIntPipe) congregationNumber: number,
    @Param("number", ParseIntPipe) number: number,
  ) {
    try {
      const query = new FindByNumberQuery(congregationNumber, number);
      return this.queryBus.ask<TerritoryResponse>(query);
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
