import { auth } from "@marcahora/auth";
import { Module } from "@nestjs/common";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { HealthController } from "./health/health.controller";
import { MembersModule } from "./organization-member/organization-member.module";
import { OrganizationsModule } from "./organizations/organizations.module";

@Module({
  controllers: [HealthController],
  imports: [
    AuthModule.forRoot({ auth, isGlobal: true }),
    OrganizationsModule,
    MembersModule,
  ],
})
export class AppModule {}
