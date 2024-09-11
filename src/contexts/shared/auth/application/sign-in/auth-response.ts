export class AuthResponse {
  public readonly access_token: string;

  constructor(token: string) {
    this.access_token = token;
  }
}
