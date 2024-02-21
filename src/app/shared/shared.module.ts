import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
  imports: [ConfigModule, JwtModule],
  providers: [ConfigService, JwtService],
  exports: [ConfigService, JwtService],
})
export class SharedModule {}
