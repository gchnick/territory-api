/* eslint-disable unicorn/no-null */
import { Prisma } from "@prisma/client";

import { Nullable } from "@/contexts/shared/domain/nullable";
import { EnviromentValueObject } from "@/contexts/shared/domain/value-object/enviroment-value-object";
import { NestPrismaService } from "@/contexts/shared/infrastructure/persistence/prisma/nest-prisma-service";
import { RoleName } from "@/contexts/shared/users/domain/role/role-name";
import { User } from "@/contexts/shared/users/domain/user";
import { UserEmail } from "@/contexts/shared/users/domain/user-email";
import { UserId } from "@/contexts/shared/users/domain/user-id";
import {
  PartialUserPrimitive,
  UserRepository,
} from "@/contexts/shared/users/domain/user-repository";
import { UserRole } from "@/contexts/shared/users/domain/user-role";

export class UserPrisma implements UserRepository {
  constructor(private readonly repository: NestPrismaService) {}

  async save(user: User): Promise<void> {
    const {
      id: user_id,
      email: username,
      password,
      roles,
    } = user.toPrimitives();

    const data: Prisma.usersCreateInput = {
      user_id,
      username,
      password,
      roles: {
        connect: roles.map(role => {
          return {
            role_id: role.id,
            user_id_role_id: { role_id: role.id, user_id },
          };
        }),
      },
    };
    await this.repository.users.create({ data });
  }

  async findByEmail(email: UserEmail): Promise<Nullable<User>> {
    const username = email.value;
    const result = await this.repository.users.findUnique({
      where: { username },
      include: { roles: { include: { role: true } } },
    });

    if (!result) return null;

    return User.fromPrimitive({
      id: result.user_id,
      email: result.username,
      password: result.password,
      enabled: result.enabled,
      verified: result.verified,
      roles: result.roles.map(rol => {
        return {
          id: rol.role_id,
          description: rol.role.description,
          name: RoleName.fromValue(rol.role.role).value,
        };
      }),
    });
  }

  async findById(id: UserId): Promise<Nullable<User>> {
    const user_id = id.value;
    const result = await this.repository.users.findUnique({
      where: { user_id },
      include: { roles: { include: { role: true } } },
    });

    if (!result) return null;

    return User.fromPrimitive({
      id: result.user_id,
      email: result.username,
      password: result.password,
      enabled: result.enabled,
      verified: result.verified,
      roles: result.roles.map(rol => {
        return {
          id: rol.role_id,
          description: rol.role.description,
          name: RoleName.fromValue(rol.role.role).value,
        };
      }),
    });
  }

  async findRole(name: RoleName): Promise<Nullable<UserRole>> {
    const role = name.value;
    const result = await this.repository.roles.findUnique({ where: { role } });

    if (!result) return null;

    return UserRole.fromPrimitives({
      id: result.id,
      name: result.role,
      description: result.description,
    });
  }

  async saveRole(userRole: UserRole): Promise<void> {
    const { name: role, description } = userRole.toPrimitives();

    const data: Prisma.rolesCreateInput = {
      role,
      description,
    };

    await this.repository.roles.create({ data });
  }

  async update(id: UserId, user: PartialUserPrimitive): Promise<void> {
    const user_id = id.value;
    const { email: username, enabled, password, roles, verified } = user;

    const data: Prisma.usersUpdateInput = {
      username,
      password,
      enabled,
      roles: {
        connect: roles?.map(role => {
          return {
            role_id: role.id,
            user_id_role_id: { role_id: role.id, user_id },
          };
        }),
      },
      verified,
    };

    await this.repository.users.update({ where: { user_id }, data });
  }

  async deleteAll(): Promise<void> {
    const nodeEnv = globalThis.process.env.NODE_ENV as string;
    const enviroment = EnviromentValueObject.fromValue(nodeEnv);

    if (!enviroment.isProduction()) {
      await this.repository.users.deleteMany({});
    }
  }
}
