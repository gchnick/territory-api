import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SignInRequest {
  @IsString()
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
}
