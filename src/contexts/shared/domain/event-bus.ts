import { DomainEventSubscribers } from "../infrastructure/event-bus/domain-event-subscribers";
import { DomainEvent } from "./domain-event";

export abstract class EventBus {
  abstract publish(events: Array<DomainEvent>): Promise<void>;
  abstract addSubscribers(subscribers: DomainEventSubscribers): void;
}
