import { DomainEvent } from "@/contexts/shared/domain/domain-event";
import { DomainEventSubscriber } from "@/contexts/shared/domain/domain-event-subscriber";

export class DomainEventSubscribers {
  constructor(public items: Array<DomainEventSubscriber<DomainEvent>>) {}

  // static from(container: ContainerBuilder): DomainEventSubscribers {
  //   const subscriberDefinitions = container.findTaggedServiceIds(
  //     'domainEventSubscriber',
  //   ) as Map<String, Definition>;
  //   const subscribers: Array<DomainEventSubscriber<DomainEvent>> = [];

  //   subscriberDefinitions.forEach((value: Definition, key: String) => {
  //     const domainEventSubscriber = container.get<
  //       DomainEventSubscriber<DomainEvent>
  //     >(key.toString());
  //     subscribers.push(domainEventSubscriber);
  //   });

  //   return new DomainEventSubscribers(subscribers);
  // }
}
