export abstract class Encode {
  abstract hashSync(
    data: string | Buffer,
    saltOrRounds: string | number,
  ): string;

  abstract hash(
    data: string | Buffer,
    saltOrRounds: string | number,
  ): Promise<string>;

  abstract compareSync(data: string | Buffer, encrypted: string): boolean;

  abstract compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}
