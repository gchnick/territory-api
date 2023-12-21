import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CommandBus } from 'src/shared/domain/command-bus';
import { CreateTerritoryCommand } from 'src/territories/domain/create-territory-command';
import { TerritoryPostRequest } from './territory-post-request';

@Controller('territories')
export class TerritoryPostController {
  constructor(private commandBus: CommandBus) {}

  @Post()
  async create(
    @Body() request: TerritoryPostRequest,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const { id, number, label, limits, lastDateCompleted } = request;
      const createTerritoryCommand = new CreateTerritoryCommand({
        id,
        number,
        label,
        limits,
        lastDateCompleted,
      });
      await this.commandBus.dispatch(createTerritoryCommand);
      res.status(HttpStatus.CREATED).send();
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
}
