import { ApiProperty } from "@nestjs/swagger";

export class OrganizationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  ownerId: string;

  @ApiProperty()
  settings: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  flActive: boolean;

  constructor(partial: Partial<OrganizationResponseDto>) {
    Object.assign(this, partial);
  }
}
