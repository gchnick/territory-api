import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { QueryBus } from '@shared/domain/query-bus';
import { FindByNumberQuery } from '@territories/application/find-by-number/find-by-number-query';
import { TerritoryResponse } from '@territories/application/find-by-number/territory-response';
import { SearchAllTerritoryQuery } from '@territories/application/search-all/search-all-territories-query';
import { TerritoriesRespose } from '@territories/application/search-all/territories-response';
import { Response } from 'express';

@Controller()
export class TerritoriesGetController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  async searchAll(@Res() res: Response): Promise<void> {
    try {
      const query = new SearchAllTerritoryQuery();
      const { territories } =
        await this.queryBus.ask<TerritoriesRespose>(query);
      res.json({ data: territories });
    } catch (error) {
      res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:number')
  async findByNumber(@Param() number, @Res() res: Response): Promise<void> {
    try {
      const query = new FindByNumberQuery(number);
      const { value } = await this.queryBus.ask<TerritoryResponse>(query);
      res.json({ data: value });
    } catch (error) {
      res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
