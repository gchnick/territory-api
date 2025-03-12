import { DomainEvent } from "@/contexts/shared/domain/domain-event";

export const DomainEventJsonSerializer = {
  serialize(event: DomainEvent): string {
    return JSON.stringify({
      data: {
        id: event.eventId,
        type: event.eventName,
        occurred_on: event.occurredOn.toString(),
        aggregateId: event.aggregateId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        attributes: event.toPrimitives(),
      },
    });
  },
};
