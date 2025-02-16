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

import { Environments } from "@/contexts/shared/domain/value-object/environment";

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

class EnvironmentVariables {
  @IsEnum(Environments)
  NODE_ENV!: Environments;

  @IsNumber()
  @Min(0)
  @Max(65_535)
  PORT!: number;

  @ValidateNested()
  DATABASE!: DatabaseEnv;

  @IsString()
  @IsNotEmpty()
  ENCRYPTION_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string;
}

export function validate(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
