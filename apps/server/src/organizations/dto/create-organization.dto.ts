import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  Matches,
} from "class-validator";

export class CreateOrganizationDto {
  @ApiProperty({ description: "Nome da organização" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "Slug único para URL" })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug deve conter apenas letras minúsculas, números e hífens",
  })
  slug: string;

  @ApiProperty({ description: "Configurações adicionais", required: false })
  @IsObject()
  @IsOptional()
  settings?: Record<string, any>;
}
