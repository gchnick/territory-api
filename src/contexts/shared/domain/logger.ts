export default abstract class Logger {
  abstract debug(message: string): void;
  abstract error(message: unknown): void;
  abstract info(message: string): void;
  abstract warn(message: string): void;
  abstract setContext(context: string): void;
}
