export default abstract class Logger {
  abstract debug(message: string): void;
  abstract error(message: string | Error): void;
  abstract info(message: string): void;
  abstract setContext(context: string): void;
}
