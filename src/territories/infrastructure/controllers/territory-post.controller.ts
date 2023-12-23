import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Response } from 'express';
import { CommandBus } from 'src/shared/domain/command-bus';
import { generatorUuid } from 'src/shared/domain/generator-uuid';
import { CreateTerritoryCommand } from 'src/territories/domain/create-territory-command';
import { Limits } from 'src/territories/domain/territory-limits';

class TerritoryPostRequest {
  @IsUUID()
  @IsOptional()
  id: string;

  @IsNumber()
  number: number;

  @IsString()
  label: string;

  limits: Limits;

  @IsDate()
  lastDateCompleted: Date;
}

@Controller()
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
        id: id ? id : generatorUuid(),
        number,
        label,
        limits,
        lastDateCompleted,
      });
      await this.commandBus.dispatch(createTerritoryCommand);
      res.set('Location', `/v1/api/territories/${createTerritoryCommand.id}`);
      res.status(HttpStatus.CREATED).send();
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
}
