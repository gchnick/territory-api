import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

import { Role } from "@/contexts/shared/users/domain/role/role-name";

export class UserPutRequest {
  @IsEmail()
  @IsOptional()
  @ApiProperty({
    description:
      "Email user to auth. If you're creating new user it's required",
    required: false,
    uniqueItems: true,
    type: String,
    example: "jhon@doe.com",
  })
  email?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    description:
      "Password user to auth. If you're creating new user it's required",
    required: false,
    type: String,
    minLength: 8,
  })
  password?: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    description: "Roles user",
    required: false,
    isArray: true,
    type: [Role],
    enum: Role,
    example: Object.keys(Role),
  })
  roles?: string[];
}
