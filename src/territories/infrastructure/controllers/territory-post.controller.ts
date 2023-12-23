import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CommandBus } from '@shared/domain/command-bus';
import { Uuid } from '@shared/domain/value-object/uuid';
import { CreateTerritoryCommand } from '@territories/domain/create-territory-command';
import { Limits } from '@territories/domain/territory-limits';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Response } from 'express';

class TerritoryPostRequest {
  @IsUUID()
  @IsOptional()
  id: string;

  @IsNumber()
  number: number;

  @IsString()
  label: string;

  @IsObject()
  limits: Limits;

  @IsDate()
  @Type(() => Date)
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
        id: id ? id : Uuid.random().value,
        number,
        label,
        limits,
        lastDateCompleted,
      });
      await this.commandBus.dispatch(createTerritoryCommand);
      res.set('Location', `/v1/api/territories/${createTerritoryCommand.id}`);
      res.status(HttpStatus.CREATED).send();
    } catch (error) {
      console.log('Error -> ', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
}
