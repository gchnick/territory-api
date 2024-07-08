import { Role } from "@/contexts/registry/users/domain/role/role-name";
import { User } from "@/contexts/registry/users/domain/user";
import { UserCreatedDomainEvent } from "@/contexts/registry/users/domain/user-created-domain-event";

export const UserCreatedDomainEventMother = {
  create({
    aggregateId,
    eventId,
    name,
    email,
    roles,
    occurredOn,
  }: {
    aggregateId: string;
    eventId?: string;
    name: string;
    email: string;
    roles: Role[];
    occurredOn?: Date;
  }): UserCreatedDomainEvent {
    return new UserCreatedDomainEvent({
      aggregateId,
      eventId,
      name,
      email,
      roles,
      occurredOn,
    });
  },
  fromUser(user: User): UserCreatedDomainEvent {
    return this.create({
      aggregateId: user.id.value,
      name: user.name.value,
      email: user.email.value,
      roles: user.roles.map(r => r.name.value),
    });
  },
};
