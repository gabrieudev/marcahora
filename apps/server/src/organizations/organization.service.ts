import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { OrganizationResponseDto } from "./dto/organization-response.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";
import { OrganizationsRepository } from "./organization.repository";
import { MembersRepository } from "@/organization-member/organization-member.repository";

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly organizationsRepository: OrganizationsRepository,
    private readonly membersRepository: MembersRepository,
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
    userId: string,
  ): Promise<OrganizationResponseDto> {
    // Verificar se o slug já existe
    const existing = await this.organizationsRepository.findBySlug(
      createOrganizationDto.slug,
    );
    if (existing) {
      throw new ConflictException("Slug já está em uso");
    }

    // Limitar número de organizações por usuário
    const userOrgCount =
      await this.organizationsRepository.countUserOrganizations(userId);
    if (userOrgCount >= 10) {
      throw new BadRequestException(
        "Limite de organizações atingido (máximo 10)",
      );
    }

    // Criar organização
    const organization = await this.organizationsRepository.create({
      ...createOrganizationDto,
      ownerId: userId,
    });

    if (!organization) {
      throw new BadRequestException("Erro ao criar organização");
    }

    const member = await this.membersRepository.findByOrganizationAndUser(
      organization.id,
      userId,
    );

    if (!member) {
      throw new NotFoundException(
        "Erro ao adicionar o criador como membro da organização",
      );
    }

    // Adicionar o criador como admin da organização
    await this.membersRepository.create({
      organizationId: organization.id,
      userId: userId,
      role: "admin",
      preferences: member.preferences,
    });

    return this.toResponse(organization);
  }

  async findAllActive(): Promise<OrganizationResponseDto[]> {
    const organizations = await this.organizationsRepository.findAllActive();
    return organizations.map((org) => this.toResponse(org));
  }

  async findOne(id: string): Promise<OrganizationResponseDto> {
    const organization = await this.organizationsRepository.findById(id);
    if (!organization) {
      throw new NotFoundException("Organização não encontrada");
    }
    return this.toResponse(organization);
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
    userId: string,
  ): Promise<OrganizationResponseDto> {
    // Verificar se a organização existe
    const organization = await this.organizationsRepository.findById(id);
    if (!organization) {
      throw new NotFoundException("Organização não encontrada");
    }

    // Verificar permissões (apenas owner pode atualizar)
    if (organization.ownerId !== userId) {
      throw new ForbiddenException(
        "Apenas o proprietário pode atualizar a organização",
      );
    }

    // Se estiver atualizando o slug, verificar se já existe
    if (
      updateOrganizationDto.slug &&
      updateOrganizationDto.slug !== organization.slug
    ) {
      const existing = await this.organizationsRepository.findBySlug(
        updateOrganizationDto.slug,
      );
      if (existing) {
        throw new ConflictException("Slug já está em uso");
      }
    }

    const updated = await this.organizationsRepository.update(
      id,
      updateOrganizationDto,
    );
    if (!updated) {
      throw new NotFoundException("Organização não encontrada");
    }

    return this.toResponse(updated);
  }

  async remove(id: string, userId: string): Promise<void> {
    const organization = await this.organizationsRepository.findById(id);
    if (!organization) {
      throw new NotFoundException("Organização não encontrada");
    }

    // Verificar permissões (apenas owner pode deletar)
    if (organization.ownerId !== userId) {
      throw new ForbiddenException(
        "Apenas o proprietário pode deletar a organização",
      );
    }

    // Soft delete - marcar como inativo
    await this.organizationsRepository.update(id, { flActive: false });
  }

  async searchByName(name: string): Promise<OrganizationResponseDto[]> {
    const organizations = await this.organizationsRepository.searchByName(name);
    return organizations.map((org) => this.toResponse(org));
  }

  async getUserOrganizations(
    userId: string,
  ): Promise<OrganizationResponseDto[]> {
    const organizations =
      await this.organizationsRepository.findByOwner(userId);
    return organizations.map((org) => this.toResponse(org));
  }

  private toResponse(org: any): OrganizationResponseDto {
    return new OrganizationResponseDto({
      ...org,
      settings: (org?.settings as Record<string, any>) ?? undefined,
    });
  }
}
