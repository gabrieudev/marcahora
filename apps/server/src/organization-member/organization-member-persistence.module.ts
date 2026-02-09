import { DatabaseModule } from "@/shared/database/database.module";
import { Module } from "@nestjs/common";
import { MembersRepository } from "./organization-member.repository";

@Module({
  imports: [DatabaseModule],
  providers: [MembersRepository],
  exports: [MembersRepository],
})
export class MembersPersistenceModule {}
