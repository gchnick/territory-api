/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import { Encode } from "@/contexts/shared/auth/domain/encode";
import { User } from "@/contexts/shared/users/domain/user";

export class MockEncode implements Encode {
  private readonly mockHash = vi.fn();
  private readonly mockCompare = vi.fn();

  hashSync(data: string | Buffer, _saltOrRounds: string | number): string {
    expect(this.mockHash).toHaveBeenCalledWith(
      data,
      User.SALT_OR_ROUNDS_ENCODE,
    );
    return this.mockHash() as string;
  }

  async hash(
    data: string | Buffer,
    _saltOrRounds: string | number,
  ): Promise<string> {
    expect(this.mockHash).toHaveBeenCalledWith(
      data,
      User.SALT_OR_ROUNDS_ENCODE,
    );
    return this.mockHash() as Promise<string>;
  }

  compareSync(data: string | Buffer, encrypted: string): boolean {
    expect(this.mockCompare).toHaveBeenCalledWith(data, encrypted);
    return this.mockCompare() as boolean;
  }

  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    expect(this.mockCompare).toHaveBeenCalledWith(data, encrypted);
    return this.mockCompare() as Promise<boolean>;
  }

  shouldHash(password: string): void {
    this.mockHash(password, User.SALT_OR_ROUNDS_ENCODE);
    this.mockHash.mockReturnValueOnce(password);
  }
}
