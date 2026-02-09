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
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { OrganizationResponseDto } from "./dto/organization-response.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";
import { OrganizationsService } from "./organization.service";

@ApiBearerAuth()
@ApiTags("organizations")
@Controller("organizations")
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @ApiOperation({ summary: "Criar uma nova organização" })
  @ApiResponse({
    status: 201,
    description: "Organização criada com sucesso",
    type: OrganizationResponseDto,
  })
  @ApiResponse({ status: 409, description: "Slug já está em uso" })
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @CurrentUser() user: { id: string },
  ): Promise<OrganizationResponseDto> {
    return this.organizationsService.create(createOrganizationDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: "Listar organizações que o usuário é membro" })
  @ApiResponse({
    status: 200,
    description: "Lista de organizações",
    type: [OrganizationResponseDto],
  })
  @ApiResponse({ status: 404, description: "Parâmetros inválidos" })
  async findAllByMember(
    @CurrentUser() user: { id: string },
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ): Promise<OrganizationResponseDto[]> {
    return this.organizationsService.findAllActiveByMember(
      user.id,
      limit,
      offset,
    );
  }

  @Get("search")
  @ApiOperation({ summary: "Buscar organizações por nome" })
  async search(
    @Query("name") name: string,
  ): Promise<OrganizationResponseDto[]> {
    return this.organizationsService.searchByName(name);
  }

  @Get("my")
  @ApiOperation({ summary: "Listar minhas organizações" })
  async getMyOrganizations(
    @CurrentUser() user: { id: string },
  ): Promise<OrganizationResponseDto[]> {
    return this.organizationsService.getUserOrganizations(user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obter uma organização por ID" })
  @ApiResponse({
    status: 200,
    description: "Organização encontrada",
    type: OrganizationResponseDto,
  })
  @ApiResponse({ status: 404, description: "Organização não encontrada" })
  async findOne(@Param("id") id: string): Promise<OrganizationResponseDto> {
    return this.organizationsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualizar uma organização" })
  @ApiResponse({
    status: 200,
    description: "Organização atualizada",
    type: OrganizationResponseDto,
  })
  @ApiResponse({ status: 403, description: "Permissão negada" })
  @ApiResponse({ status: 404, description: "Organização não encontrada" })
  async update(
    @Param("id") id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
    @CurrentUser() user: { id: string },
  ): Promise<OrganizationResponseDto> {
    return this.organizationsService.update(id, updateOrganizationDto, user.id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover uma organização (soft delete)" })
  @ApiResponse({ status: 204, description: "Organização removida" })
  @ApiResponse({ status: 403, description: "Permissão negada" })
  @ApiResponse({ status: 404, description: "Organização não encontrada" })
  async remove(
    @Param("id") id: string,
    @CurrentUser() user: { id: string },
  ): Promise<void> {
    await this.organizationsService.remove(id, user.id);
  }
}
