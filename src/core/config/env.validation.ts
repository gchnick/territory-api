import { plainToInstance } from "class-transformer";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
  validateSync,
} from "class-validator";

import { Enviroment } from "@/contexts/shared/domain/value-object/enviroment-value-object";

class DatabaseEnv {
  @IsString()
  @IsNotEmpty()
  HOST!: string;

  @IsNumber()
  @Min(0)
  @Max(65_535)
  PORT!: number;

  @IsString()
  @IsNotEmpty()
  NAME!: string;

  @IsString()
  @IsNotEmpty()
  USERNAME!: string;

  @IsString()
  @IsNotEmpty()
  PASSWORD!: string;
}

class EnviromentVariables {
  @IsEnum(Enviroment)
  NODE_ENV!: Enviroment;

  @IsNumber()
  @Min(0)
  @Max(65_535)
  PORT!: number;

  @IsString()
  @IsNotEmpty()
  SQLITE_DATABASE!: string;

  @ValidateNested()
  DATABASE!: DatabaseEnv;

  @IsString()
  @IsNotEmpty()
  ENCRYPTION_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string;
}

export function validate(config: Record<string, unknown>): EnviromentVariables {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const validatedConfig = plainToInstance(EnviromentVariables, config, {
    enableImplicitConversion: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return validatedConfig;
}
