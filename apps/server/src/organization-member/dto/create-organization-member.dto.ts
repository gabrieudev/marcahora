import { orgRole } from "@marcahora/db/schema/schema";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateMemberDto {
  @ApiProperty({ description: "ID do usuário (ou email se convidado)" })
  @IsString()
  @IsNotEmpty()
  userIdOrEmail: string;

  @ApiProperty({
    description: "Papel do membro",
    enum: orgRole.enumValues,
    default: "membro",
  })
  @IsEnum(orgRole.enumValues)
  @IsOptional()
  role?: "admin" | "organizador" | "membro";

  @ApiProperty({ description: "Preferências do membro", required: false })
  @IsObject()
  @IsOptional()
  preferences?: Record<string, any>;
}
