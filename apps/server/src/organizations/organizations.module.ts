import { DatabaseModule } from "@/shared/database/database.module";
import { MembersPersistenceModule } from "@/organization-member/organization-member-persistence.module";
import { Module } from "@nestjs/common";
import { OrganizationsController } from "./organization.controller";
import { OrganizationsRepository } from "./organization.repository";
import { OrganizationsService } from "./organization.service";

@Module({
  imports: [MembersPersistenceModule, DatabaseModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, OrganizationsRepository],
  exports: [OrganizationsRepository, OrganizationsService],
})
export class OrganizationsModule {}
