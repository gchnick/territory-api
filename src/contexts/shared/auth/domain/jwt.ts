export abstract class Jwt {
  abstract signAsync(
    payload: Buffer | object,
    options?: unknown,
  ): Promise<string>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract verifyAsync<T extends object = any>(
    token: string,
    options?: unknown,
  ): Promise<T>;
}
