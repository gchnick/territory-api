import { PrismaClient } from "@/db/client/auth";

import { PrismaMapper } from "@/contexts/shared/infrastructure/persistence/prisma/repositories/prisma-mapper";
import { UserPrimitives } from "@/contexts/shared/users/domain/user";

export class UserMapper extends PrismaMapper<"users"> {
  toModel(
    primitives: UserPrimitives,
  ): Parameters<PrismaClient["users"]["create"]> {
    const {
      id: publisher_id,
      email: username,
      password,
      roles,
      enabled,
      verified,
    } = primitives;

    const connectOrCreate = roles.map(r => ({
      where: { role_id: r.id },
      create: {
        role_id: r.id,
        role: r.name,
        description: r.description,
      },
    }));

    return [
      {
        data: {
          publisher_id,
          username,
          password,
          enabled,
          verified,
          roles: {
            connectOrCreate,
          },
        },
      },
    ];
  }
}
