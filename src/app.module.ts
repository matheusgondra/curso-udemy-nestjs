import { forwardRef, Module } from "@nestjs/common";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 100
      }
    ])
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
