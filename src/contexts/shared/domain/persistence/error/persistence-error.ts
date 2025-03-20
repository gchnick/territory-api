export class PersistenceError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    stack?: unknown,
  ) {
    super(message, { cause: { stack } });
  }
}
