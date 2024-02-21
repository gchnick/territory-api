import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignUpRequest {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsArray()
  roles!: string[];
}
