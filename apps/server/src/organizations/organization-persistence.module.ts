import { DatabaseModule } from "@/shared/database/database.module";
import { Module } from "@nestjs/common";
import { OrganizationsRepository } from "./organization.repository";

@Module({
  imports: [DatabaseModule],
  providers: [OrganizationsRepository],
  exports: [OrganizationsRepository],
})
export class OrganizationPersistenceModule {}
