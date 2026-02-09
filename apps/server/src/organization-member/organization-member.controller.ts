import { CurrentUser } from "@/shared/auth/current-user.decorator";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { MemberResponseDto } from "./dto/organization-member-response.dto";
import type { CreateMemberDto } from "./dto/create-organization-member.dto";
import type { TransferOwnershipDto } from "./dto/transfer-ownership.dto";
import type { UpdateMemberDto } from "./dto/update-organization-member.dto";
import { MembersService } from "./organization-member.service";

@ApiTags("organization-members")
@ApiBearerAuth()
@Controller("organizations/:organizationId/members")
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @ApiOperation({ summary: "Adicionar um novo membro à organização" })
  @ApiResponse({
    status: 201,
    description: "Membro adicionado com sucesso",
    type: MemberResponseDto,
  })
  @ApiResponse({ status: 403, description: "Permissão negada" })
  @ApiResponse({ status: 409, description: "Usuário já é membro" })
  async create(
    @Param("organizationId") organizationId: string,
    @Body() createMemberDto: CreateMemberDto,
    @CurrentUser() user: { id: string },
  ): Promise<MemberResponseDto> {
    return this.membersService.addMember(
      organizationId,
      createMemberDto,
      user.id,
    );
  }

  @Get()
  @ApiOperation({ summary: "Listar todos os membros de uma organização" })
  @ApiQuery({ name: "includeInactive", required: false, type: Boolean })
  @ApiResponse({
    status: 200,
    description: "Lista de membros",
    type: [MemberResponseDto],
  })
  async findAll(
    @Param("organizationId") organizationId: string,
    @Query("includeInactive") includeInactive?: boolean,
  ): Promise<MemberResponseDto[]> {
    return this.membersService.findAll(
      organizationId,
      includeInactive === true,
    );
  }

  @Get("my")
  @ApiOperation({ summary: "Listar minhas associações a organizações" })
  @ApiQuery({ name: "includeInactive", required: false, type: Boolean })
  async getMyMemberships(
    @CurrentUser() user: { id: string },
    @Query("includeInactive") includeInactive?: boolean,
  ): Promise<MemberResponseDto[]> {
    return this.membersService.getMyMemberships(
      user.id,
      includeInactive === true,
    );
  }

  @Get(":memberId")
  @ApiOperation({ summary: "Obter um membro por ID" })
  @ApiResponse({
    status: 200,
    description: "Membro encontrado",
    type: MemberResponseDto,
  })
  @ApiResponse({ status: 404, description: "Membro não encontrado" })
  async findOne(
    @Param("organizationId") organizationId: string,
    @Param("memberId") memberId: string,
  ): Promise<MemberResponseDto> {
    return this.membersService.findOne(organizationId, memberId);
  }

  @Patch(":memberId")
  @ApiOperation({ summary: "Atualizar um membro" })
  @ApiResponse({
    status: 200,
    description: "Membro atualizado",
    type: MemberResponseDto,
  })
  @ApiResponse({ status: 403, description: "Permissão negada" })
  @ApiResponse({ status: 404, description: "Membro não encontrado" })
  async update(
    @Param("organizationId") organizationId: string,
    @Param("memberId") memberId: string,
    @Body() updateMemberDto: UpdateMemberDto,
    @CurrentUser() user: { id: string },
  ): Promise<MemberResponseDto> {
    return this.membersService.update(
      organizationId,
      memberId,
      updateMemberDto,
      user.id,
    );
  }

  @Delete(":memberId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover um membro da organização" })
  @ApiResponse({ status: 204, description: "Membro removido" })
  @ApiResponse({ status: 403, description: "Permissão negada" })
  @ApiResponse({ status: 404, description: "Membro não encontrado" })
  async remove(
    @Param("organizationId") organizationId: string,
    @Param("memberId") memberId: string,
    @CurrentUser() user: { id: string },
  ): Promise<void> {
    await this.membersService.remove(organizationId, memberId, user.id);
  }

  @Post("transfer-ownership")
  @ApiOperation({
    summary: "Transferir propriedade da organização para outro membro",
  })
  @ApiResponse({
    status: 200,
    description: "Propriedade transferida",
    type: MemberResponseDto,
  })
  @ApiResponse({ status: 403, description: "Permissão negada" })
  async transferOwnership(
    @Param("organizationId") organizationId: string,
    @Body() transferDto: TransferOwnershipDto,
    @CurrentUser() user: { id: string },
  ): Promise<MemberResponseDto> {
    return this.membersService.transferOwnership(
      organizationId,
      transferDto,
      user.id,
    );
  }

  @Delete("leave")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Sair da organização" })
  @ApiResponse({ status: 204, description: "Saiu da organização" })
  @ApiResponse({ status: 403, description: "Permissão negada" })
  async leaveOrganization(
    @Param("organizationId") organizationId: string,
    @CurrentUser() user: { id: string },
  ): Promise<void> {
    await this.membersService.leaveOrganization(organizationId, user.id);
  }
}
