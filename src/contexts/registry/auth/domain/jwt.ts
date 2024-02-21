export abstract class Jwt {
  abstract signAsync(
    payload: Buffer | object,
    options?: unknown,
  ): Promise<string>;
}
