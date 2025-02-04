import * as bcrypt from "bcrypt";

import { Encode } from "@/contexts/shared/auth/domain/encode";

import { Injectable } from "../dependency-injection/injectable";

@Injectable()
export class Bcrypt implements Encode {
  hashSync(data: string | Buffer, saltOrRounds: string | number): string {
    return bcrypt.hashSync(data, saltOrRounds);
  }

  async hash(
    data: string | Buffer,
    saltOrRounds: string | number,
  ): Promise<string> {
    return bcrypt.hash(data, saltOrRounds);
  }

  compareSync(data: string | Buffer, encrypted: string): boolean {
    return bcrypt.compareSync(data, encrypted);
  }

  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
