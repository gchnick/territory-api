import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SignInRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Email user to auth",
    uniqueItems: true,
    required: true,
    example: "jhon@doe.com",
  })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Password user to auth",
    required: true,
    minLength: 8,
  })
  password!: string;
}
