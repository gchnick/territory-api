import { DomainEvent } from "../../domain/domain-event";

export const DomainEventJsonSerializer = {
  serialize(event: DomainEvent): string {
    return JSON.stringify({
      data: {
        id: event.eventId,
        type: event.eventName,
        occurred_on: event.occurredOn.toISOString(),
        aggregateId: event.aggregateId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        attributes: event.toPrimitives(),
      },
    });
  },
};
