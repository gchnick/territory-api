import { Temporal } from "temporal-polyfill";

import { Role } from "@/contexts/shared/users/domain/role/role-name";
import { User } from "@/contexts/shared/users/domain/user";
import { UserCreatedDomainEvent } from "@/contexts/shared/users/domain/user-created-domain-event";

export const UserCreatedDomainEventMother = {
  create({
    aggregateId,
    eventId,
    email,
    roles,
    occurredOn,
  }: {
    aggregateId: string;
    eventId?: string;
    email: string;
    roles: Role[];
    occurredOn?: Temporal.Instant;
  }): UserCreatedDomainEvent {
    return new UserCreatedDomainEvent({
      aggregateId,
      eventId,
      email,
      roles,
      occurredOn,
    });
  },
  fromUser(user: User): UserCreatedDomainEvent {
    return this.create({
      aggregateId: user.id.value,
      email: user.email.value,
      roles: user.roles.map(r => r.name.value),
    });
  },
};
