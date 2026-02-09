import { DatabaseModule } from "@/shared/database/database.module";
import { OrganizationPersistenceModule } from "@/organizations/organization-persistence.module";
import { Module } from "@nestjs/common";
import { MembersController } from "./organization-member.controller";
import { MembersRepository } from "./organization-member.repository";
import { MembersService } from "./organization-member.service";

@Module({
  imports: [OrganizationPersistenceModule, DatabaseModule],
  controllers: [MembersController],
  providers: [MembersService, MembersRepository],
  exports: [MembersRepository, MembersService],
})
export class MembersModule {}
