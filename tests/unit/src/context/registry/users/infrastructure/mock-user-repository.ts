/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable jest/no-standalone-expect */
import { RoleName } from "@/contexts/registry/users/domain/role/role-name";
import { User } from "@/contexts/registry/users/domain/user";
import { UserEmail } from "@/contexts/registry/users/domain/user-email";
import { UserId } from "@/contexts/registry/users/domain/user-id";
import { UserRepository } from "@/contexts/registry/users/domain/user-repository";
import { UserRole } from "@/contexts/registry/users/domain/user-role";
import { DeepPartial } from "@/contexts/shared/domain/deep-partial";
import { Nullable } from "@/contexts/shared/domain/nullable";

export class MockUserRepository implements UserRepository {
  private readonly mockSave = jest.fn();
  private readonly mockFindByEmail = jest.fn();
  private readonly mockFindById = jest.fn();
  private readonly mockFindRole = jest.fn();
  private readonly mockSaveRole = jest.fn();
  private readonly mockUpdate = jest.fn();
  private readonly mockTruncate = jest.fn();

  async save(user: User): Promise<void> {
    expect(this.mockSave).toHaveBeenCalledWith(user.toPrimitives());
  }

  async findByEmail(email: UserEmail): Promise<Nullable<User>> {
    expect(this.mockFindByEmail).toHaveBeenCalledWith(email);
    return this.mockFindByEmail() as Promise<Nullable<User>>;
  }

  async findById(id: UserId): Promise<Nullable<User>> {
    expect(this.mockFindById).toHaveBeenCalledWith(id);
    return this.mockFindById() as Promise<Nullable<User>>;
  }

  async findRole(name: RoleName): Promise<Nullable<UserRole>> {
    expect(this.mockFindRole).toHaveBeenCalledWith(name);
    return this.mockFindRole() as Promise<Nullable<UserRole>>;
  }

  async saveRole(role: UserRole): Promise<void> {
    expect(this.mockSaveRole).toHaveBeenCalledWith(role.toPrimitives());
  }

  async update(id: UserId, data: DeepPartial<User>): Promise<void>;
  async update(id: UserId, data: User): Promise<void> {
    expect(this.mockUpdate).toHaveBeenCalledWith(id, data);
    this.mockUpdate();
  }

  async deleteAll(): Promise<void> {
    this.mockTruncate();
  }

  shouldSave(user: User): void {
    this.mockSave(user.toPrimitives());
  }

  shouldFindByEmail(user: User): void {
    this.mockFindByEmail(user.email);
    this.mockFindByEmail.mockReturnValueOnce(user);
  }

  shouldFindById(user: User): void {
    this.mockFindById(user.id);
    this.mockFindById.mockReturnValueOnce(user);
  }

  shouldNotSearch(email: UserEmail): void {
    const nullableUser: Nullable<User> = undefined;
    this.mockFindByEmail(email);
    this.mockFindByEmail.mockReturnValueOnce(nullableUser);
  }

  shouldFindRole(userRole: UserRole) {
    this.mockFindRole(userRole.name);
    this.mockFindRole.mockReturnValueOnce(userRole);
  }

  shouldSaveRole(role: UserRole): void {
    this.mockSaveRole(role.toPrimitives());
  }
}
