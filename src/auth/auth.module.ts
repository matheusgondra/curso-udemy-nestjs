import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.register({
      secret: "d0d0e73c-4880-4208-bcbe-f96023830f10"
    })
  ]
})
export class AuthModule {}
