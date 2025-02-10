import { DomainEvent } from "./domain-event";

export abstract class AggregateRoot {
  #domainEvents: DomainEvent[];

  constructor() {
    this.#domainEvents = [];
  }

  pullDomainEvents(): DomainEvent[] {
    const domainEvents = [...this.#domainEvents];
    this.#domainEvents = [];

    return domainEvents;
  }

  record(event: DomainEvent): void {
    this.#domainEvents.push(event);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract toPrimitives(): any;
}
