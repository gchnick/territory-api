import { ConfigService } from "@nestjs/config";
import { DataSource, EntitySchema } from "typeorm";

import { DeepPartial } from "@/shared/domain/deep-partial";
import { Nullable } from "@/shared/domain/nullable";
import { TypeOrmRepository } from "@/shared/infrastructure/persistence/typeorm/type-orm-repository";

import { RoleName } from "../../domain/role/role-name";
import { User } from "../../domain/user";
import { UserEmail } from "../../domain/user-email";
import { UserId } from "../../domain/user-id";
import { UserNotFount } from "../../domain/user-not-fount";
import { UserRepository } from "../../domain/user-repository";
import { UserRole } from "../../domain/user-role";
import { RoleEntity } from "./typeorm/role-entity";
import { UserEntity } from "./typeorm/user-entity";

/**
 * @deprecated TypeOrm will be remove to Prisma ORM
 */
export class UserTypeOrm
  extends TypeOrmRepository<User>
  implements UserRepository
{
  constructor(dataSource: DataSource, configService: ConfigService) {
    super(dataSource, configService);
  }

  protected entitySchema(): EntitySchema<User> {
    return UserEntity;
  }

  async save(user: User): Promise<void> {
    await this.persist(user);
  }

  async findByEmail(email: UserEmail): Promise<Nullable<User>> {
    return await this.repository().findOneBy({ email });
  }

  async findById(id: UserId): Promise<Nullable<User>> {
    return await this.repository().findOneBy({ id });
  }

  async findRole(name: RoleName): Promise<Nullable<UserRole>> {
    const repository = this.dataSource().getRepository(RoleEntity);
    return await repository.findOneBy({ name });
  }

  async saveRole(role: UserRole): Promise<void> {
    const repository = this.dataSource().getRepository(RoleEntity);
    await repository.save(role);
  }

  async update(id: UserId, data: DeepPartial<User>): Promise<void>;
  async update(id: UserId, data: User): Promise<void> {
    const { id: withId, ..._data } = data;

    if (withId) {
      await this.repository().save(data);
    } else {
      const user = await this.repository().preload({ id, ..._data });

      if (!user) {
        throw new UserNotFount(`User with id <${id.value}> not found`);
      }

      await this.repository().save(user);
    }
  }

  async deleteAll(): Promise<void> {
    await this.truncate();
  }
}
