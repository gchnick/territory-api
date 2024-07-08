/* eslint-disable @typescript-eslint/no-explicit-any */

export type LogLevel = "log" | "error" | "warn" | "debug" | "verbose" | "fatal";

export default abstract class Logger {
  abstract error(message: any, stack?: string, context?: string): void;
  abstract error(
    message: any,
    ...optionalParams: [...any, string?, string?]
  ): void;

  abstract log(message: any, context?: string): void;
  abstract log(message: any, ...optionalParams: [...any, string?]): void;

  abstract warn(message: any, context?: string): void;
  abstract warn(message: any, ...optionalParams: [...any, string?]): void;

  abstract debug(message: any, context?: string): void;
  abstract debug(message: any, ...optionalParams: [...any, string?]): void;

  abstract verbose(message: any, context?: string): void;
  abstract verbose(message: any, ...optionalParams: [...any, string?]): void;

  abstract fatal(message: any, context?: string): void;
  abstract fatal(message: any, ...optionalParams: [...any, string?]): void;

  abstract setLogLevels?(levels: LogLevel[]): any;
}
