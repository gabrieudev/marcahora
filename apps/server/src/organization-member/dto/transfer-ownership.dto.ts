import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class TransferOwnershipDto {
  @ApiProperty({ description: "ID do novo proprietário" })
  @IsString()
  @IsNotEmpty()
  newOwnerUserId: string;
}
