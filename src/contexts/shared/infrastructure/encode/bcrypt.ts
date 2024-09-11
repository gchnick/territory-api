/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
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
    return await bcrypt.hash(data, saltOrRounds);
  }

  compareSync(data: string | Buffer, encrypted: string): boolean {
    return bcrypt.compareSync(data, encrypted);
  }

  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(data, encrypted);
  }
}
