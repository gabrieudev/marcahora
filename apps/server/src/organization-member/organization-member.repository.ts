import { Inject, Injectable } from "@nestjs/common";
import {
  organizationMembers,
  organizations,
  users,
} from "@marcahora/db/schema/schema";
import type {
  OrganizationMember,
  NewOrganizationMember,
  UserOrganizationMember,
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

  async findById(id: string): Promise<UserOrganizationMember | null> {
    const [result] = await this.db
      .select({
        member: organizationMembers,
        user: users,
        organization: organizations,
      })
      .from(organizationMembers)
      .leftJoin(users, eq(users.id, organizationMembers.userId))
      .leftJoin(
        organizations,
        eq(organizations.id, organizationMembers.organizationId),
      )
      .where(eq(organizationMembers.id, id));

    if (!result) return null;

    return {
      ...(result.member as OrganizationMember),
      user: result.user ?? null,
      organization: result.organization ?? null,
    };
  }

  async findByOrganizationAndUser(
    organizationId: string,
    userId: string,
  ): Promise<UserOrganizationMember | null> {
    const [result] = await this.db
      .select({
        member: organizationMembers,
        user: users,
        organization: organizations,
      })
      .from(organizationMembers)
      .leftJoin(users, eq(users.id, organizationMembers.userId))
      .leftJoin(
        organizations,
        eq(organizations.id, organizationMembers.organizationId),
      )
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),
          eq(organizationMembers.userId, userId),
        ),
      );

    if (!result) return null;

    return {
      ...(result.member as OrganizationMember),
      user: result.user ?? null,
      organization: result.organization ?? null,
    };
  }

  async findByOrganization(
    organizationId: string,
    includeInactive = false,
    limit?: number,
    offset?: number,
  ): Promise<UserOrganizationMember[]> {
    let query = this.db
      .select({
        member: organizationMembers,
        user: users,
        organization: organizations,
      })
      .from(organizationMembers)
      .leftJoin(users, eq(users.id, organizationMembers.userId))
      .leftJoin(
        organizations,
        eq(organizations.id, organizationMembers.organizationId),
      )
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
      .$dynamic();

    if (limit !== undefined && offset !== undefined) {
      query = query.limit(limit).offset(offset);
    }

    const results = await query;

    return results.map((result) => ({
      ...(result.member as OrganizationMember),
      user: result.user ?? null,
      organization: result.organization ?? null,
    }));
  }

  async findByUser(
    userId: string,
    includeInactive = false,
  ): Promise<UserOrganizationMember[]> {
    let query = this.db
      .select({
        member: organizationMembers,
        user: users,
        organization: organizations,
      })
      .from(organizationMembers)
      .leftJoin(users, eq(users.id, organizationMembers.userId))
      .leftJoin(
        organizations,
        eq(organizations.id, organizationMembers.organizationId),
      )
      .where(
        and(
          eq(organizationMembers.userId, userId),
          includeInactive ? undefined : eq(organizationMembers.flActive, true),
        ),
      );

    const results = await query;

    return results.map((result) => ({
      ...(result.member as OrganizationMember),
      user: result.user ?? null,
      organization: result.organization ?? null,
    }));
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
  ): Promise<UserOrganizationMember[]> {
    let query = this.db
      .select({
        member: organizationMembers,
        user: users,
        organization: organizations,
      })
      .from(organizationMembers)
      .leftJoin(users, eq(users.id, organizationMembers.userId))
      .leftJoin(
        organizations,
        eq(organizations.id, organizationMembers.organizationId),
      )
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),
          eq(organizationMembers.isOwner, true),
          eq(organizationMembers.flActive, true),
        ),
      );

    const results = await query;

    return results.map((result) => ({
      ...(result.member as OrganizationMember),
      user: result.user ?? null,
      organization: result.organization ?? null,
    }));
  }
}
