import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

import { TerritoryLabel } from "@/contexts/Overseer/territories/domain/territory-label";
import { TerritoryLocality } from "@/contexts/Overseer/territories/domain/territory-locality";

export class TerritoryPostRequest {
  @ApiProperty({
    description: "Congregation number",
    required: true,
    type: Number,
    minimum: 1,
    example: 7047,
  })
  @IsNumber()
  congregationId!: number;

  @ApiProperty({
    description: "The territory is currently assigned to someone to preach",
    required: true,
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  currentAssigned!: boolean;

  @ApiProperty({
    description: "Territory name",
    required: true,
    type: String,
    minLength: 1,
    maxLength: TerritoryLabel.MAXIMUM_CHARACTERS,
    example: "New Ocean",
  })
  @IsString()
  @IsNotEmpty()
  label!: string;

  @ApiProperty({
    description:
      "Date old last completion. Value as Temporal Plain Date format.",
    required: true,
    type: String,
    example: "2023-03-01",
  })
  @IsDateString()
  lastDateCompleted!: string;

  @ApiProperty({
    description: "Complete localities included in the territory",
    required: true,
    type: String,
    minLength: 1,
    maxLength: TerritoryLocality.MAXIMUM_CHARACTERS,
    example: "Street 3, Street 4",
  })
  @IsString()
  @IsNotEmpty()
  locality!: string;

  @ApiProperty({
    description: "Localities included in part in the territory",
    required: false,
    type: String,
    minLength: 1,
    example: "Ocean Park, Street 21, Street 22",
  })
  @IsString()
  @IsOptional()
  localityInPart?: string;

  @ApiProperty({
    description: "Territory map URL",
    required: false,
    type: String,
    minLength: 1,
  })
  @IsString()
  @IsOptional()
  map?: string;

  @ApiProperty({
    description: "Territory number",
    required: true,
    type: Number,
    minimum: 1,
    example: 5,
  })
  @IsNumber()
  number!: number;

  @ApiProperty({
    description: "Number of houses in the territory",
    required: true,
    type: Number,
    minimum: 1,
    maximum: 100,
    example: 5,
  })
  @IsNumber()
  quantityHouses!: number;

  @ApiProperty({
    description: "Sector to which the territory belongs",
    required: false,
    type: String,
    minLength: 1,
    example: "Bull Ranch",
  })
  @IsString()
  @IsOptional()
  sector?: string;
}
