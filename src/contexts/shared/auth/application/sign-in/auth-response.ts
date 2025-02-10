import { ApiProperty } from "@nestjs/swagger";

export class AuthResponse {
  @ApiProperty({ description: "Token to authenticate in the API" })
  public readonly access_token: string;

  constructor(token: string) {
    this.access_token = token;
  }
}
