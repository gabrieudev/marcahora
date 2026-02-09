import { auth } from "@marcahora/auth";
import { Module } from "@nestjs/common";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { AuthController } from "./shared/auth/auth.controller";
import { HealthController } from "./health/health.controller";
import { OrganizationsModule } from "./organizations/organizations.module";
import { MembersModule } from "./organization-member/organization-member.module";

@Module({
  controllers: [AuthController, HealthController],
  imports: [
    AuthModule.forRoot({ auth, isGlobal: true }),
    OrganizationsModule,
    MembersModule,
  ],
})
export class AppModule {}
