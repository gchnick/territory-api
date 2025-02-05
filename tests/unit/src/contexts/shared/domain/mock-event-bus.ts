/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DomainEvent } from "@/shared/domain/domain-event";
import { EventBus } from "@/shared/domain/event-bus";
import { DomainEventSubscribers } from "@/shared/infrastructure/event-bus/domain-event-subscribers";

export class MockEventBus implements EventBus {
  private readonly mockPublish = vi.fn();

  async publish(events: DomainEvent[]) {
    await this.mockPublish(events);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addSubscribers(_subscribers: DomainEventSubscribers): void {}

  shouldLastPublishedEventIs(expectedEvent: DomainEvent) {
    const publishSpyCalls = this.mockPublish.mock.calls;

    expect(publishSpyCalls.length).toBeGreaterThan(0);

    const lastPublishSpyCall = publishSpyCalls.at(-1);
    const lastPublishedEvent = lastPublishSpyCall[0][0] as DomainEvent;

    const expected = this.#getDataFromDomainEvent(expectedEvent);
    const published = this.#getDataFromDomainEvent(lastPublishedEvent);

    expect(expected).toMatchObject(published);
  }

  #getDataFromDomainEvent(event: DomainEvent) {
    const { eventId, occurredOn, ...attributes } = event;

    return attributes;
  }
}
