import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CommandBus } from '@shared/domain/command-bus';
import Logger from '@shared/domain/logger';
import { InvalidArgumentError } from '@shared/domain/value-object/invalid-argument-error';
import { Uuid } from '@shared/domain/value-object/uuid';
import { CreateTerritoryCommand } from '@territories/domain/create-territory-command';
import { Limits } from '@territories/domain/territory-limits';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
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
  @IsNotEmpty()
  label: string;

  @IsObject()
  @IsNotEmptyObject()
  limits: Limits;

  @IsDate()
  @Type(() => Date)
  lastDateCompleted: Date;
}

@Controller()
export class TerritoryPostController {
  constructor(
    private log: Logger,
    private commandBus: CommandBus,
  ) {}

  @Post()
  async create(@Body() request: TerritoryPostRequest, @Res() res: Response) {
    try {
      const { id, number, label, limits, lastDateCompleted } = request;
      const createTerritoryCommand = new CreateTerritoryCommand({
        id: id ? id : Uuid.random().value,
        number,
        label,
        limits,
        lastDateCompleted: new Date(lastDateCompleted),
      });
      await this.commandBus.dispatch(createTerritoryCommand);
      res.set('Location', `/v1/api/territories/${createTerritoryCommand.id}`);
      res.status(HttpStatus.CREATED).send();
    } catch (error) {
      if (error instanceof InvalidArgumentError) {
        this.log.info(error.message);
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: error.message });
      }
      this.log.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
}
