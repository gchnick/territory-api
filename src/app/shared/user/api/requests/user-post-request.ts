import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserPostRequest {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsArray()
  roles!: string[];
}
