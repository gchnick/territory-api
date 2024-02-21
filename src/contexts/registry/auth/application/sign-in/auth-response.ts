export interface Token {
  access_token: string;
}

export class AuthResponse {
  public readonly value: Token;

  constructor(token: string) {
    this.value = {
      access_token: token,
    };
  }
}
