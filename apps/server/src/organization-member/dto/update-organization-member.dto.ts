import { PartialType } from "@nestjs/swagger";
import { CreateMemberDto } from "./create-organization-member.dto";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
  @IsBoolean()
  @IsOptional()
  flActive?: boolean;
}
