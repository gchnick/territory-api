import { Nullable } from "@/contexts/shared/domain/nullable";
import { getNodeEnv } from "@/contexts/shared/domain/value-object/environment";
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
  constructor(private readonly _repository: NestPrismaService) {}

  async save(user: User): Promise<void> {
    const {
      id: user_id,
      email: username,
      password,
      roles,
      enabled,
      verified,
    } = user.toPrimitives();

    const connectOrCreate = roles.map(r => ({
      where: { role_id: r.id },
      create: {
        role_id: r.id,
        role: r.name,
        description: r.description,
      },
    }));

    await this._repository.users.create({
      data: {
        user_id,
        username,
        password,
        enabled,
        verified,
        roles: {
          connectOrCreate,
        },
      },
    });
  }

  async findByEmail(email: UserEmail): Promise<Nullable<User>> {
    const username = email.value;
    const result = await this._repository.users.findUnique({
      where: { username },
      include: { roles: true },
    });

    if (!result) return;

    return User.fromPrimitives({
      id: result.user_id,
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
    const user_id = id.value;
    const result = await this._repository.users.findUnique({
      where: { user_id },
      include: { roles: true },
    });

    if (!result) return;

    return User.fromPrimitives({
      id: result.user_id,
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
    const result = await this._repository.roles.findUnique({ where: { role } });

    if (!result) return;

    return UserRole.fromPrimitives({
      id: result.role_id,
      name: result.role,
      description: result.description ?? undefined,
    });
  }

  async saveRole(userRole: UserRole): Promise<void> {
    const { id: role_id, name: role, description } = userRole.toPrimitives();

    await this._repository.roles.create({
      data: { role_id, role, description },
    });
  }

  async update(id: UserId, user: PartialUserPrimitive): Promise<void> {
    const { email: username, enabled, password, roles, verified } = user;

    const currentRolesResult = await this._repository.users.findUnique({
      select: { roles: { select: { role_id: true } } },
      where: { user_id: id.value },
    });

    const currentRoles = currentRolesResult?.roles.map(r => r.role_id);
    const futureRoles = roles?.map(r => r.id);

    const { remove, add } = this.#updateRolesQuery(currentRoles, futureRoles);

    const transaction = [
      this._repository.users.update({
        where: { user_id: id.value },
        data: {
          roles: { disconnect: remove.map(id => ({ role_id: id })) },
        },
      }),
      this._repository.users.update({
        where: { user_id: id.value },
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

    await this._repository.$transaction(transaction);
  }

  async deleteAllRoles(): Promise<void> {
    const environment = getNodeEnv();
    if (!environment.isProduction()) {
      await this._repository.roles.deleteMany({});
    }
  }

  async deleteAll(): Promise<void> {
    const environment = getNodeEnv();
    if (!environment.isProduction()) {
      await this._repository.users.deleteMany({});
    }
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
