import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignUpRequest {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: "Email user to auth",
    required: true,
    uniqueItems: true,
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
