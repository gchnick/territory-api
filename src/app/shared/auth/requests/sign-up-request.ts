import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

import { Role } from "@/src/contexts/shared/users/domain/role/role-name";

export class SignUpRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Name user", nullable: false })
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: "Email user to auth",
    uniqueItems: true,
    nullable: false,
  })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Password user to auth",
    nullable: false,
    minLength: 8,
  })
  password!: string;

  @IsArray()
  @ApiProperty({
    description: "Roles user",
    nullable: false,
    isArray: true,
    enum: Role,
    example: Object.keys(Role),
  })
  roles!: string[];
}
