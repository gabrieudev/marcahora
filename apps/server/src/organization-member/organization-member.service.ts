import { OrganizationsRepository } from "@/organizations/organization.repository";
import {
  organizationMembers,
  organizations,
  users,
} from "@marcahora/db/schema/schema";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import type { NeonDatabase } from "drizzle-orm/neon-serverless";
import { CreateMemberDto } from "./dto/create-organization-member.dto";
import { MemberResponseDto } from "./dto/organization-member-response.dto";
import { TransferOwnershipDto } from "./dto/transfer-ownership.dto";
import { UpdateMemberDto } from "./dto/update-organization-member.dto";
import { MembersRepository } from "./organization-member.repository";
import { DRIZZLE_DB } from "@/shared/database/database.constants";

@Injectable()
export class MembersService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: NeonDatabase,
    private readonly membersRepository: MembersRepository,
    private readonly organizationsRepository: OrganizationsRepository,
  ) {}

  private async getUserFromIdentifier(identifier: string) {
    // Verifica se é um email
    if (identifier.includes("@")) {
      const [user] = await this.db
        .select()
        .from(users)
        .where(eq(users.email, identifier));
      return user;
    }

    // Se não for email, assume que é ID de usuário
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, identifier));
    return user;
  }

  async addMember(
    organizationId: string,
    createMemberDto: CreateMemberDto,
    currentUserId: string,
  ): Promise<MemberResponseDto> {
    // Verificar se a organização existe
    const organization =
      await this.organizationsRepository.findById(organizationId);

    if (!organization) {
      throw new NotFoundException("Organização não encontrada");
    }

    // Verificar permissões do usuário atual
    const currentUserMember =
      await this.membersRepository.findByOrganizationAndUser(
        organizationId,
        currentUserId,
      );

    if (!currentUserMember || !currentUserMember.flActive) {
      throw new ForbiddenException("Você não é membro desta organização");
    }

    // Apenas admins/owners podem adicionar membros
    if (currentUserMember.role !== "admin" && !currentUserMember.isOwner) {
      throw new ForbiddenException(
        "Apenas administradores podem adicionar membros",
      );
    }

    // Buscar usuário pelo identificador (email ou ID)
    const user = await this.getUserFromIdentifier(
      createMemberDto.userIdOrEmail,
    );

    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    // Verificar se o usuário já é membro
    const existingMember =
      await this.membersRepository.findByOrganizationAndUser(
        organizationId,
        user.id,
      );

    if (existingMember) {
      if (existingMember.flActive) {
        throw new ConflictException("Usuário já é membro desta organização");
      } else {
        // Se estiver inativo, reativar
        const updated = await this.membersRepository.update(existingMember.id, {
          flActive: true,
          role: createMemberDto.role || existingMember.role,
          preferences:
            createMemberDto.preferences || existingMember.preferences,
        });

        if (!updated) {
          throw new NotFoundException("Membro não encontrado para reativação");
        }

        return new MemberResponseDto({
          ...updated,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image ?? undefined,
          },
        });
      }
    }

    // Verificar limite de membros por organização (exemplo: máximo 100)
    const memberCount =
      await this.membersRepository.countOrganizationMembers(organizationId);
    if (memberCount >= 100) {
      throw new BadRequestException("Limite de membros atingido (máximo 100)");
    }

    // Não permitir criar outro owner
    if (createMemberDto.role === "admin" && organization.ownerId !== user.id) {
      throw new BadRequestException(
        "Não é possível criar outro owner. Apenas um owner por organização.",
      );
    }

    const member = await this.membersRepository.create({
      organizationId,
      userId: user.id,
      role: createMemberDto.role || "membro",
      preferences: createMemberDto.preferences || {},
    });

    return new MemberResponseDto({
      ...member,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image ?? undefined,
      },
    });
  }

  async findAll(
    organizationId: string,
    includeInactive = false,
  ): Promise<MemberResponseDto[]> {
    // Verificar se a organização existe
    await this.organizationsRepository.findById(organizationId);

    const membersWithUsers =
      await this.membersRepository.findMembersWithUserDetails(
        organizationId,
        includeInactive,
      );

    return membersWithUsers.map(
      (item) =>
        new MemberResponseDto({
          ...item.member,
          user: item.user,
        }),
    );
  }

  async findOne(
    organizationId: string,
    memberId: string,
  ): Promise<MemberResponseDto> {
    const member = await this.membersRepository.findById(memberId);
    if (!member || member.organizationId !== organizationId) {
      throw new NotFoundException("Membro não encontrado");
    }

    const [user] = await this.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
      })
      .from(users)
      .where(eq(users.id, member.userId));

    return new MemberResponseDto({
      ...member,
      user,
    });
  }

  async update(
    organizationId: string,
    memberId: string,
    updateMemberDto: UpdateMemberDto,
    currentUserId: string,
  ): Promise<MemberResponseDto> {
    // Buscar o membro
    const member = await this.membersRepository.findById(memberId);
    if (!member || member.organizationId !== organizationId) {
      throw new NotFoundException("Membro não encontrado");
    }

    // Verificar permissões do usuário atual
    const currentUserMember =
      await this.membersRepository.findByOrganizationAndUser(
        organizationId,
        currentUserId,
      );

    if (!currentUserMember || !currentUserMember.flActive) {
      throw new ForbiddenException("Você não é membro desta organização");
    }

    // Apenas admins/owners podem atualizar outros membros
    const isSelf = member.userId === currentUserId;
    const isAdminOrOwner =
      currentUserMember.role === "admin" || currentUserMember.isOwner;

    if (!isSelf && !isAdminOrOwner) {
      throw new ForbiddenException("Sem permissão para atualizar este membro");
    }

    // Se não for admin/owner, só pode atualizar suas próprias preferências
    if (!isAdminOrOwner && isSelf) {
      if (Object.keys(updateMemberDto).some((key) => key !== "preferences")) {
        throw new ForbiddenException(
          "Você só pode atualizar suas preferências",
        );
      }
    }

    // Validar regras específicas
    if (
      updateMemberDto.role &&
      member.isOwner &&
      updateMemberDto.role !== "admin"
    ) {
      throw new BadRequestException("O owner deve sempre ter role de admin");
    }

    // Não permitir alterar o status de owner via update comum
    if ("isOwner" in updateMemberDto) {
      throw new BadRequestException(
        "Não é possível alterar o status de owner desta forma",
      );
    }

    const updated = await this.membersRepository.update(
      memberId,
      updateMemberDto,
    );
    if (!updated) {
      throw new NotFoundException("Membro não encontrado");
    }

    const [user] = await this.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
      })
      .from(users)
      .where(eq(users.id, updated.userId));

    return new MemberResponseDto({
      ...updated,
      user,
    });
  }

  async remove(
    organizationId: string,
    memberId: string,
    currentUserId: string,
  ): Promise<void> {
    const member = await this.membersRepository.findById(memberId);
    if (!member || member.organizationId !== organizationId) {
      throw new NotFoundException("Membro não encontrado");
    }

    // Verificar permissões do usuário atual
    const currentUserMember =
      await this.membersRepository.findByOrganizationAndUser(
        organizationId,
        currentUserId,
      );

    if (!currentUserMember || !currentUserMember.flActive) {
      throw new ForbiddenException("Você não é membro desta organização");
    }

    const isSelf = member.userId === currentUserId;
    const isAdminOrOwner =
      currentUserMember.role === "admin" || currentUserMember.isOwner;

    if (!isSelf && !isAdminOrOwner) {
      throw new ForbiddenException("Sem permissão para remover este membro");
    }

    // Não permitir que o owner se remova (deve transferir ownership primeiro)
    if (member.isOwner) {
      throw new BadRequestException(
        "O owner não pode ser removido. Transfira a propriedade primeiro.",
      );
    }

    // Verificar se há pelo menos um admin restante (se estiver removendo um admin)
    if (member.role === "admin" && isAdminOrOwner && !isSelf) {
      const adminMembers = await this.db
        .select()
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.organizationId, organizationId),
            eq(organizationMembers.role, "admin"),
            eq(organizationMembers.flActive, true),
            eq(organizationMembers.isOwner, false),
          ),
        );

      if (adminMembers.length <= 1) {
        throw new BadRequestException(
          "Não é possível remover o último admin da organização",
        );
      }
    }

    // Soft delete - marcar como inativo
    await this.membersRepository.update(memberId, { flActive: false });
  }

  async transferOwnership(
    organizationId: string,
    transferDto: TransferOwnershipDto,
    currentUserId: string,
  ): Promise<MemberResponseDto> {
    // Buscar o membro atual (deve ser o owner atual)
    const currentOwnerMember =
      await this.membersRepository.findByOrganizationAndUser(
        organizationId,
        currentUserId,
      );

    if (!currentOwnerMember || !currentOwnerMember.isOwner) {
      throw new ForbiddenException(
        "Apenas o owner atual pode transferir a propriedade",
      );
    }

    // Buscar o novo owner
    const newOwnerMember =
      await this.membersRepository.findByOrganizationAndUser(
        organizationId,
        transferDto.newOwnerUserId,
      );

    if (!newOwnerMember || !newOwnerMember.flActive) {
      throw new NotFoundException(
        "Novo proprietário não encontrado como membro ativo da organização",
      );
    }

    // Não pode transferir para si mesmo
    if (newOwnerMember.userId === currentUserId) {
      throw new BadRequestException("Você já é o proprietário");
    }

    // Iniciar transação
    const result = await this.db.transaction(async (tx) => {
      // Remover owner do atual
      await tx
        .update(organizationMembers)
        .set({ isOwner: false })
        .where(
          and(
            eq(organizationMembers.organizationId, organizationId),
            eq(organizationMembers.userId, currentUserId),
          ),
        );

      // Tornar o novo usuário owner e admin
      const [updatedNewOwner] = await tx
        .update(organizationMembers)
        .set({ isOwner: true, role: "admin" })
        .where(
          and(
            eq(organizationMembers.organizationId, organizationId),
            eq(organizationMembers.userId, transferDto.newOwnerUserId),
          ),
        )
        .returning();

      // Atualizar a tabela organizations para refletir o novo owner
      await tx
        .update(organizations)
        .set({ ownerId: transferDto.newOwnerUserId })
        .where(eq(organizations.id, organizationId));

      return updatedNewOwner;
    });

    if (!result) {
      throw new NotFoundException("Membro para transferência não encontrado");
    }

    const [user] = await this.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
      })
      .from(users)
      .where(eq(users.id, result.userId));

    return new MemberResponseDto({
      ...result,
      user,
    });
  }

  async getMyMemberships(
    userId: string,
    includeInactive = false,
  ): Promise<MemberResponseDto[]> {
    const memberships = await this.membersRepository.findByUser(
      userId,
      includeInactive,
    );

    // Para cada membership, buscar detalhes da organização
    const membershipsWithOrgs = await Promise.all(
      memberships.map(async (membership) => {
        const org = await this.organizationsRepository.findById(
          membership.organizationId,
        );

        if (!org) {
          throw new NotFoundException("Organização não encontrada");
        }

        return new MemberResponseDto({
          ...membership,
          user: undefined,
          organization: {
            id: org.id,
            name: org.name,
            slug: org.slug,
          },
        });
      }),
    );

    return membershipsWithOrgs;
  }

  async leaveOrganization(
    organizationId: string,
    userId: string,
  ): Promise<void> {
    const member = await this.membersRepository.findByOrganizationAndUser(
      organizationId,
      userId,
    );

    if (!member) {
      throw new NotFoundException("Você não é membro desta organização");
    }

    // O owner não pode sair da organização (deve transferir ownership primeiro)
    if (member.isOwner) {
      throw new BadRequestException(
        "O owner não pode sair da organização. Transfira a propriedade primeiro.",
      );
    }

    // Verificar se é o último admin
    if (member.role === "admin") {
      const adminMembers = await this.db
        .select()
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.organizationId, organizationId),
            eq(organizationMembers.role, "admin"),
            eq(organizationMembers.flActive, true),
            eq(organizationMembers.isOwner, false),
          ),
        );

      if (adminMembers.length <= 1) {
        throw new BadRequestException(
          "Não é possível sair como o último admin da organização",
        );
      }
    }

    // Soft delete - marcar como inativo
    await this.membersRepository.update(member.id, { flActive: false });
  }
}
