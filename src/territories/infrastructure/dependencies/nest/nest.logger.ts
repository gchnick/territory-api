import { ConsoleLogger } from '@nestjs/common';
import Logger from '@shared/domain/logger';

export class NestLogger extends ConsoleLogger implements Logger {
  info(message: string): void {
    this.log(message);
  }
}
