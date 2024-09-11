import { EventEmitter } from "node:events";

import { DomainEvent } from "@/shared/domain/domain-event";
import { EventBus } from "@/shared/domain/event-bus";

import { DomainEventSubscribers } from "../domain-event-subscribers";

// eslint-disable-next-line unicorn/prefer-event-target
export class InMemoryAsyncEventBus extends EventEmitter implements EventBus {
  // eslint-disable-next-line @typescript-eslint/require-await
  async publish(events: DomainEvent[]): Promise<void> {
    events.map(event => this.emit(event.eventName, event));
  }

  addSubscribers(subscribers: DomainEventSubscribers) {
    for (const subscriber of subscribers.items) {
      for (const event of subscriber.subscribedTo()) {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.on(event.EVENT_NAME, subscriber.on.bind(subscriber));
      }
    }
  }
}
