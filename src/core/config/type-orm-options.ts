import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { DatabaseType } from "typeorm";

export default (): TypeOrmModuleAsyncOptions => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const type = configService.get<DatabaseType>("database.type");
    return type === "sqlite"
      ? {
          type: "sqlite",
          database: configService.get("database.name"),
          synchronize: configService.get("nodeEnv") !== "production",
          autoLoadEntities: true,
        }
      : {
          type: "postgres",
          host: configService.get("database.host"),
          port: configService.get("database.port"),
          database: configService.get("database.name"),
          username: configService.get("database.username"),
          password: configService.get("database.password"),
          synchronize: configService.get("nodeEnv") !== "production",
          autoLoadEntities: true,
        };
  },
});
