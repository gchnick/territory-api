import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthResponse } from '@auth/application/sign-in/auth-response';
import { SignInQuery } from '@auth/application/sign-in/sign-in-query';
import { CommandBus } from '@shared/domain/command-bus';
import Logger from '@shared/domain/logger';
import { QueryBus } from '@shared/domain/query-bus';
import { InvalidArgumentError } from '@shared/domain/value-object/invalid-argument-error';
import { Uuid } from '@shared/domain/value-object/uuid';
import { CreateUserCommand } from '@users/domain/create-user.command';
import { SignInRequest, SignUpRequest } from './requests';

@Controller()
export class AuthController {
  constructor(
    private readonly log: Logger,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() request: SignInRequest) {
    const { email, password } = request;
    const query = new SignInQuery(email, password);
    return await this.queryBus.ask<AuthResponse>(query);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(@Body() request: SignUpRequest, @Res() res: Response) {
    const { name, email, password, roles } = request;
    const id = Uuid.random().value;
    try {
      const command = new CreateUserCommand({
        id,
        name,
        email,
        password,
        roles,
      });

      await this.commandBus.dispatch(command);

      res.set('Location', `/v1/api/users/${id}`);
    } catch (e) {
      if (e instanceof InvalidArgumentError) {
        this.log.warn(e.message);
        throw new BadRequestException(e.message);
      }
      this.log.error(e);
      throw new InternalServerErrorException('Check server logs');
    }
  }
}
