import { DomainEvent } from "@/shared/domain/domain-event";
import { DomainEventSubscriber } from "@/shared/domain/domain-event-subscriber";

export class DomainEventSubscribers {
  constructor(public items: DomainEventSubscriber<DomainEvent>[]) {}
}
