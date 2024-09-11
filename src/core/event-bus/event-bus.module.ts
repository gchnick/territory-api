import { Global, Module, Provider } from "@nestjs/common";

import { EventBus } from "@/shared/domain/event-bus";
import { InMemoryAsyncEventBus } from "@/shared/infrastructure/event-bus/in-memory/in-memory-async-event-bus";

const eventBusProvider: Provider = {
  provide: EventBus,
  useClass: InMemoryAsyncEventBus,
};

@Global()
@Module({
  providers: [eventBusProvider],
  exports: [eventBusProvider],
})
export class EventBusModule {}
