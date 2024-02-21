import { Repository } from "typeorm";

import { User } from "@src/contexts/registry/users/domain/user";
import { UserEmail } from "@src/contexts/registry/users/domain/user-email";
import { UserRepository } from "@src/contexts/registry/users/domain/user-repository";

import { User as UserEntity } from "./user.entity";

export class UserTypeormSqlite extends UserRepository {
  constructor(private readonly repository: Repository<UserEntity>) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async save(user: User): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const primitives = user.toPrimitives();
    // const userCreated = this.repository.create(primitives); FIXME: Implements
    // await this.repository.save(userCreated); FIXME: Implements
  }

  async findOne(_email: UserEmail): Promise<User> {
    const user = await this.repository.findOneBy({ email: _email.value });
    if (!user) {
      throw new Error("Todo error"); // TODO:
    }
    const { id, name, email, password, enabled, verified, roles } = user;

    return User.fromPrimitive({
      id,
      name,
      email,
      password,
      enabled,
      verified,
      roles: roles.map(r => r.role),
    });
  }
}
