import { PrismaClient } from "@prisma/client/extension";

export abstract class PrismaMapper<
  U extends Exclude<keyof PrismaClient, symbol | `$${string}`>,
> {
  abstract toModel(primitives: unknown): Parameters<PrismaClient[U]["create"]>;
}
