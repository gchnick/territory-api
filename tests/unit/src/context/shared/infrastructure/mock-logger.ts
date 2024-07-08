/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jest/no-standalone-expect */
import Logger, { LogLevel } from "@/contexts/shared/domain/logger";

export class MockLogger implements Logger {
  private readonly mockLogger = jest.fn();
  private readonly mockLogLevels = jest.fn();

  error(
    message: any,
    stack?: string | undefined,
    context?: string | undefined,
  ): void;
  error(message: any, ...optionalParams: any[]): void;
  error(
    message: unknown,
    stack?: unknown,
    context?: unknown,
    ...rest: unknown[]
  ): void {
    this.mockLogger();
  }
  log(message: any, context?: string | undefined): void;
  log(message: any, ...optionalParams: any[]): void;
  log(message: unknown, context?: unknown, ...rest: unknown[]): void {
    this.mockLogger();
  }
  warn(message: any, context?: string | undefined): void;
  warn(message: any, ...optionalParams: any[]): void;
  warn(message: unknown, context?: unknown, ...rest: unknown[]): void {
    this.mockLogger();
  }
  debug(message: any, context?: string | undefined): void;
  debug(message: any, ...optionalParams: any[]): void;
  debug(message: unknown, context?: unknown, ...rest: unknown[]): void {
    this.mockLogger();
  }
  verbose(message: any, context?: string | undefined): void;
  verbose(message: any, ...optionalParams: any[]): void;
  verbose(message: unknown, context?: unknown, ...rest: unknown[]): void {
    this.mockLogger();
  }
  fatal(message: any, context?: string | undefined): void;
  fatal(message: any, ...optionalParams: any[]): void;
  fatal(message: unknown, context?: unknown, ...rest: unknown[]): void {
    this.mockLogger();
  }

  setLogLevels?(levels: LogLevel[]) {
    expect(this.mockLogLevels).toHaveBeenCalledWith(levels);
  }

  shouldSetLogLevels(context: string) {
    this.mockLogLevels(context);
  }
}
