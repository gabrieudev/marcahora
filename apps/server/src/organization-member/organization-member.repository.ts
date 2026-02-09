import { Inject, Injectable } from "@nestjs/common";
import { organizationMembers, users } from "@marcahora/db/schema/schema";
import type {
  OrganizationMember,
  NewOrganizationMember,
} from "./organization-member.schema";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import type { NeonDatabase } from "drizzle-orm/neon-serverless";
import { DRIZZLE_DB } from "@/shared/database/database.constants";

@Injectable()
export class MembersRepository {
  constructor(@Inject(DRIZZLE_DB) private readonly db: NeonDatabase) {}

  async create(
    data: NewOrganizationMember,
  ): Promise<OrganizationMember | null> {
    const [member] = await this.db
      .insert(organizationMembers)
      .values(data)
      .returning();
    if (!member) {
      return null;
    }
    return member;
  }

  async findById(id: string): Promise<OrganizationMember | null> {
    const [member] = await this.db
      .select()
      .from(organizationMembers)
      .where(eq(organizationMembers.id, id));
    return member || null;
  }

  async findByOrganizationAndUser(
    organizationId: string,
    userId: string,
  ): Promise<OrganizationMember | null> {
    const [member] = await this.db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),
          eq(organizationMembers.userId, userId),
        ),
      );
    return member || null;
  }

  async findByOrganization(
    organizationId: string,
    includeInactive = false,
    limit = 50,
    offset = 0,
  ): Promise<OrganizationMember[]> {
    return this.db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),
          includeInactive ? undefined : eq(organizationMembers.flActive, true),
        ),
      )
      .orderBy(
        desc(organizationMembers.isOwner),
        asc(organizationMembers.joinedAt),
      )
      .limit(limit)
      .offset(offset);
  }

  async findByUser(
    userId: string,
    includeInactive = false,
  ): Promise<OrganizationMember[]> {
    let query = this.db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.userId, userId),
          includeInactive ? undefined : eq(organizationMembers.flActive, true),
        ),
      );

    return query.orderBy(desc(organizationMembers.joinedAt));
  }

  async update(
    id: string,
    data: Partial<NewOrganizationMember>,
  ): Promise<OrganizationMember | null> {
    const [updated] = await this.db
      .update(organizationMembers)
      .set(data)
      .where(eq(organizationMembers.id, id))
      .returning();
    return updated || null;
  }

  async delete(id: string): Promise<boolean> {
    const [deleted] = await this.db
      .delete(organizationMembers)
      .where(eq(organizationMembers.id, id))
      .returning({ id: organizationMembers.id });
    return !!deleted;
  }

  async countOrganizationMembers(organizationId: string): Promise<number> {
    const [result] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),
          eq(organizationMembers.flActive, true),
        ),
      );
    return result?.count || 0;
  }

  async countUserOrganizations(userId: string): Promise<number> {
    const [result] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.userId, userId),
          eq(organizationMembers.flActive, true),
        ),
      );
    return result?.count || 0;
  }

  async getOrganizationOwners(
    organizationId: string,
  ): Promise<OrganizationMember[]> {
    return this.db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),
          eq(organizationMembers.isOwner, true),
          eq(organizationMembers.flActive, true),
        ),
      );
  }

  async findMembersWithUserDetails(
    organizationId: string,
    includeInactive = false,
  ) {
    let query = this.db
      .select({
        member: organizationMembers,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(organizationMembers)
      .leftJoin(users, eq(organizationMembers.userId, users.id))
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),
          includeInactive ? undefined : eq(organizationMembers.flActive, true),
        ),
      );

    return query.orderBy(
      desc(organizationMembers.isOwner),
      asc(organizationMembers.joinedAt),
    );
  }
}
