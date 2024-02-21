/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jest/no-standalone-expect */
import Logger from "@contexts/shared/domain/logger";

export class MockLogger implements Logger {
  private readonly mockLogger = jest.fn();
  private readonly mockContext = jest.fn();

  debug(_message: string): void {
    this.mockLogger();
  }
  error(_message: string | Error): void {
    this.mockLogger();
  }
  info(_message: string): void {
    this.mockLogger();
  }
  warn(_message: string): void {
    this.mockLogger();
  }

  setContext(context: string): void {
    expect(this.mockContext).toHaveBeenCalledWith(context);
  }

  shouldSetContext(context: string) {
    this.mockContext(context);
  }
}
