import { DomainEvent, DomainEventClass } from "./domain-event";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface DomainEventSubscriber<T extends DomainEvent> {
  subscribedTo(): DomainEventClass[];
  on(domainEvent: T): Promise<void>;
}
