import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";

export default (): TypeOrmModuleAsyncOptions => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return {
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
