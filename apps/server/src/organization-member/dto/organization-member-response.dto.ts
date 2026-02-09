import { ApiProperty } from "@nestjs/swagger";

export class MemberResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  organizationId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: ["admin", "organizador", "membro"] })
  role: string;

  @ApiProperty()
  joinedAt: string | null;

  @ApiProperty()
  isOwner: boolean | null;

  @ApiProperty()
  preferences: Record<string, any> | unknown;

  @ApiProperty()
  flActive: boolean | null;

  @ApiProperty({ required: false })
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  } | null;

  @ApiProperty({ required: false })
  organization?: {
    id: string;
    name: string;
    slug: string;
  } | null;

  constructor(partial: Partial<MemberResponseDto>) {
    Object.assign(this, partial);
  }
}
