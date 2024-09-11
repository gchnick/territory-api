import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserPostRequest {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsArray()
  roles!: string[];
}
