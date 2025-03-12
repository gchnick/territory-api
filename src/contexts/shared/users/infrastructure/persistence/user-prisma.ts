import { Nullable } from "@/contexts/shared/domain/nullable";
import { AuthPrismaRepository } from "@/contexts/shared/infrastructure/persistence/prisma/repositories/auth-prisma-repository";
import { RoleName } from "@/contexts/shared/users/domain/role/role-name";
import { User } from "@/contexts/shared/users/domain/user";
import { UserEmail } from "@/contexts/shared/users/domain/user-email";
import { UserId } from "@/contexts/shared/users/domain/user-id";
import {
  PartialUserPrimitive,
  UserRepository,
} from "@/contexts/shared/users/domain/user-repository";
import { UserRole } from "@/contexts/shared/users/domain/user-role";

import { environment } from "@/core/config/configuration";

import { UserMapper } from "./user-mapper";

export class UserPrisma
  extends AuthPrismaRepository<User, "users">
  implements UserRepository
{
  async save(user: User): Promise<void> {
    const userMapper = new UserMapper();
    await this.persist(user, userMapper);
  }

  async findByEmail(email: UserEmail): Promise<Nullable<User>> {
    const username = email.value;
    const result = await this.repository().findUnique({
      where: { username },
      include: { roles: true },
    });

    if (!result) return;

    return User.fromPrimitives({
      id: result.publisher_id,
      email: result.username,
      password: result.password,
      enabled: result.enabled,
      verified: result.verified,
      roles: result.roles.map(rol => ({
        id: rol.role_id,
        description: rol.description ?? undefined,
        name: RoleName.fromValue(rol.role).value,
      })),
    });
  }

  async findById(id: UserId): Promise<Nullable<User>> {
    const publisher_id = id.value;
    const result = await this.repository().findUnique({
      where: { publisher_id },
      include: { roles: true },
    });

    if (!result) return;

    return User.fromPrimitives({
      id: result.publisher_id,
      email: result.username,
      password: result.password,
      enabled: result.enabled,
      verified: result.verified,
      roles: result.roles.map(rol => ({
        id: rol.role_id,
        description: rol.description ?? undefined,
        name: RoleName.fromValue(rol.role).value,
      })),
    });
  }

  async findRole(name: RoleName): Promise<Nullable<UserRole>> {
    const role = name.value;
    const result = await this.client().roles.findUnique({ where: { role } });

    if (!result) return;

    return UserRole.fromPrimitives({
      id: result.role_id,
      name: result.role,
      description: result.description ?? undefined,
    });
  }

  async saveRole(userRole: UserRole): Promise<void> {
    const { id: role_id, name: role, description } = userRole.toPrimitives();

    await this.client().roles.create({
      data: { role_id, role, description },
    });
  }

  async update(id: UserId, user: PartialUserPrimitive): Promise<void> {
    const repository = this.repository();
    const { email: username, enabled, password, roles, verified } = user;

    const currentRolesResult = await repository.findUnique({
      select: { roles: { select: { role_id: true } } },
      where: { publisher_id: id.value },
    });

    const currentRoles = currentRolesResult?.roles.map(r => r.role_id);
    const futureRoles = roles?.map(r => r.id);

    const { remove, add } = this.#updateRolesQuery(currentRoles, futureRoles);

    const transaction = [
      repository.update({
        where: { publisher_id: id.value },
        data: {
          roles: { disconnect: remove.map(id => ({ role_id: id })) },
        },
      }),
      repository.update({
        where: { publisher_id: id.value },
        data: {
          username,
          password,
          enabled,
          roles: {
            connect: add.map(id => ({ role_id: id })),
          },
          verified,
        },
      }),
    ];

    await this.unitOfWork(transaction);
  }

  async deleteAllRoles(): Promise<void> {
    if (!environment.isProduction()) {
      await this.client().roles.deleteMany({});
    }
  }

  async deleteAll(): Promise<void> {
    await this.truncate();
  }

  #updateRolesQuery(currentRoles: number[] = [], futureRoles: number[] = []) {
    const current = new Set(currentRoles);
    const future = new Set(futureRoles);
    return {
      remove: [...current.difference(future)],
      add: [...future.difference(current)],
    };
  }
}
