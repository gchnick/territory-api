import { Temporal } from "temporal-polyfill";

import { DomainEvent } from "@/shared/domain/domain-event";

import { Role } from "./role/role-name";

type CreateUserDomainEventAttributes = {
  readonly email: string;
  readonly roles: Role[];
};

export class UserCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = "user.created";

  readonly email: string;
  readonly roles: Role[];

  constructor({
    aggregateId,
    email,
    roles,
    eventId,
    occurredOn,
  }: {
    aggregateId: string;
    eventId?: string;
    email: string;
    roles: Role[];
    occurredOn?: Temporal.Instant;
  }) {
    super({
      eventName: UserCreatedDomainEvent.EVENT_NAME,
      aggregateId,
      eventId,
      occurredOn,
    });
    this.email = email;
    this.roles = roles;
  }

  toPrimitives(): CreateUserDomainEventAttributes {
    const { email, roles } = this;
    return {
      email,
      roles,
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    eventId: string;
    occurredOn: Temporal.Instant;
    attributes: CreateUserDomainEventAttributes;
  }): DomainEvent {
    const { aggregateId, attributes, occurredOn, eventId } = params;
    return new UserCreatedDomainEvent({
      aggregateId,
      email: attributes.email,
      roles: attributes.roles,
      eventId,
      occurredOn,
    });
  }
}
