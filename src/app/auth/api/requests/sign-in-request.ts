import { IsNotEmpty, IsString } from "class-validator";

export class SignInRequest {
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
