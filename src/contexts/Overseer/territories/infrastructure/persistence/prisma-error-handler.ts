import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { PersistenceHandlerError } from "@/contexts/shared/domain/persistence/error/persistence-handler-error";
import { UniqueConstrainFailed } from "@/contexts/shared/domain/persistence/error/unique-constrain-failed";

export class PrismaErrorHandler extends PersistenceHandlerError {
  constructor() {
    super({ P2002: UniqueConstrainFailed });
  }

  handle(error: unknown): void {
    if (error instanceof PrismaClientKnownRequestError) {
      const { code, message } = error;
      this.throwPersistenceError(code, message);
    }
  }
}
