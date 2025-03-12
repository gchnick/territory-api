import { CongregationRepository } from "@/contexts/Overseer/congregations/domain/congregation-repository";
import { ExternalPrismaRepository } from "@/contexts/shared/infrastructure/persistence/prisma/repositories/external-prisma-repository";

import { Congregation } from "../domain/congregation";
import { CongregationMapper } from "./congregation-mapper";

export class CongregationPrisma
  extends ExternalPrismaRepository<Congregation, "congregations">
  implements CongregationRepository
{
  async save(congregation: Congregation): Promise<void> {
    const congregationMapper = new CongregationMapper();

    await this.persist(congregation, congregationMapper);
  }

  async deleteAll(): Promise<void> {
    await this.truncate();
  }
}
