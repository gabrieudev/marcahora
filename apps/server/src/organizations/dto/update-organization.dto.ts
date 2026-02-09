import { PartialType } from "@nestjs/swagger";
import { CreateOrganizationDto } from "./create-organization.dto";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
  @IsBoolean()
  @IsOptional()
  flActive?: boolean;
}
