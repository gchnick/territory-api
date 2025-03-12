/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Prisma, PrismaClient } from "@/db/client/external";

import { AggregateRoot } from "@/contexts/shared/domain/aggregate-root";

import { environment } from "@/core/config/configuration";

import { NestExternalPrismaService } from "../services/nest-external-prisma.service";
import { PrismaMapper } from "./prisma-mapper";

export abstract class ExternalPrismaRepository<
  T extends AggregateRoot,
  U extends Exclude<keyof PrismaClient, symbol | `$${string}`>,
> {
  constructor(
    private readonly _repository: NestExternalPrismaService,
    private readonly model: U,
  ) {}

  protected repository(): PrismaClient[U] {
    return this._repository[this.model];
  }

  protected async persist(
    aggregateRoot: T,
    mapper: PrismaMapper<U>,
  ): Promise<void> {
    const repository = this.repository();
    const args = mapper.toModel(aggregateRoot.toPrimitives());
    await (repository.create as any)(...args);
  }

  protected async unitOfWork<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: { isolationLevel?: Prisma.TransactionIsolationLevel },
  ) {
    return await this._repository.$transaction(arg, options);
  }

  protected async truncate(): Promise<void> {
    if (!environment.isProduction()) {
      const repository = this.repository();
      await (repository.deleteMany as any)({});
    }
  }
}
