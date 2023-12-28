import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import Logger from '@shared/domain/logger';
import { QueryBus } from '@shared/domain/query-bus';
import { FindByNumberQuery } from '@territories/application/find-by-number/find-by-number-query';
import { TerritoryResponse } from '@territories/application/find-by-number/territory-response';
import { SearchAllTerritoryQuery } from '@territories/application/search-all/search-all-territories-query';
import { TerritoriesRespose } from '@territories/application/search-all/territories-response';
import { TerritoryNotFount } from '@territories/domain/territory-not-fount';
import { Response } from 'express';

@Controller()
export class TerritoriesGetController {
  constructor(
    private log: Logger,
    private queryBus: QueryBus,
  ) {}

  @Get()
  async searchAll(@Res() res: Response): Promise<void> {
    try {
      const query = new SearchAllTerritoryQuery();
      const { territories } =
        await this.queryBus.ask<TerritoriesRespose>(query);
      res.json({ data: territories });
    } catch (error) {
      this.log.info(error);
      throw new InternalServerErrorException('Check server logs');
    }
  }

  @Get('/:number')
  async findByNumber(
    @Param('number', ParseIntPipe) number: number,
    @Res() res: Response,
  ) {
    try {
      const query = new FindByNumberQuery(number);
      const { value } = await this.queryBus.ask<TerritoryResponse>(query);
      res.json({ data: value });
    } catch (error) {
      if (error instanceof TerritoryNotFount) {
        this.log.info(error.message);
        throw new NotFoundException(error.message);
      } else {
        this.log.error(error);
        throw new InternalServerErrorException('Check server logs');
      }
    }
  }
}
