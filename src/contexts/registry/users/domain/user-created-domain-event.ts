import { DomainEvent } from "@/contexts/shared/domain/domain-event";

import { Role } from "./role/role-name";

type CreateUserDomainEventAttributes = {
  readonly name: string;
  readonly email: string;
  readonly roles: Role[];
};

export class UserCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = "user.created";

  readonly name: string;
  readonly email: string;
  readonly roles: Role[];

  constructor({
    aggregateId,
    name,
    email,
    roles,
    eventId,
    occurredOn,
  }: {
    aggregateId: string;
    eventId?: string;
    name: string;
    email: string;
    roles: Role[];
    occurredOn?: Date;
  }) {
    super({
      eventName: UserCreatedDomainEvent.EVENT_NAME,
      aggregateId,
      eventId,
      occurredOn,
    });
    this.name = name;
    this.email = email;
    this.roles = roles;
  }

  toPrimitives(): CreateUserDomainEventAttributes {
    const { name, email, roles } = this;
    return {
      name,
      email,
      roles,
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    eventId: string;
    occurredOn: Date;
    attributes: CreateUserDomainEventAttributes;
  }): DomainEvent {
    const { aggregateId, attributes, occurredOn, eventId } = params;
    return new UserCreatedDomainEvent({
      aggregateId,
      name: attributes.name,
      email: attributes.email,
      roles: attributes.roles,
      eventId,
      occurredOn,
    });
  }
}
