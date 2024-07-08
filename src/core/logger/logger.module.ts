import { Global, Logger as LoggerNest, Module, Provider } from "@nestjs/common";
import { LogLevel } from "@nestjs/common/services/logger.service";
import { ConfigService } from "@nestjs/config";

import { SharedModule } from "@/core/shared/shared.module";

import Logger from "@/contexts/shared/domain/logger";

const loggerProvider: Provider = {
  provide: Logger,
  useFactory: (configService: ConfigService) => {
    const level = configService.get<LogLevel>("LOGGER_LEVEL", "log");
    const logger = new LoggerNest();
    logger.localInstance.setLogLevels?.([level]);
    return logger;
  },
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [SharedModule],
  providers: [loggerProvider],
  exports: [loggerProvider],
})
export class LoggerModule {}
