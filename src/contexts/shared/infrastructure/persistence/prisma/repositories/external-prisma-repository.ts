/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PrismaClient } from "@/db/client/external";

import { AggregateRoot } from "@/contexts/shared/domain/aggregate-root";

import { environment } from "@/core/config/configuration";

import { NestExternalPrismaService } from "../services/nest-external-prisma.service";
import { PrismaMapper } from "./prisma-mapper";

export abstract class ExternalPrismaRepository<
  T extends AggregateRoot,
  U extends Exclude<keyof PrismaClient, symbol | `$${string}`>,
> {
  readonly #model!: U;

  constructor(private readonly _repository: NestExternalPrismaService) {}

  protected repository(): PrismaClient[U] {
    return this._repository[this.#model];
  }

  protected async persist(
    aggregateRoot: T,
    mapper: PrismaMapper<U>,
  ): Promise<void> {
    const repository = this.repository();
    const args = mapper.toModel(aggregateRoot.toPrimitives());
    await (repository.create as any)(...args);
  }

  protected async truncate(): Promise<void> {
    if (!environment.isProduction()) {
      const repository = this.repository();
      await (repository.deleteMany as any)({});
    }
  }
}
