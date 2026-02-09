import { DRIZZLE_DB } from "@/shared/database/database.constants";
import {
  organizationMembers,
  organizations,
} from "@marcahora/db/schema/schema";
import { Inject, Injectable } from "@nestjs/common";
import { and, desc, eq, like, sql } from "drizzle-orm";
import type { NeonDatabase } from "drizzle-orm/neon-serverless";
import type { NewOrganization, Organization } from "./organization.schema";

@Injectable()
export class OrganizationsRepository {
  constructor(@Inject(DRIZZLE_DB) private readonly db: NeonDatabase) {}

  async create(data: NewOrganization): Promise<Organization | null> {
    const [organization] = await this.db
      .insert(organizations)
      .values(data)
      .returning();
    if (!organization) {
      return null;
    }
    return organization;
  }

  async findById(id: string): Promise<Organization | null> {
    const [organization] = await this.db
      .select()
      .from(organizations)
      .where(eq(organizations.id, id));
    return organization || null;
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    const [organization] = await this.db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, slug));
    return organization || null;
  }

  async findByOwner(ownerId: string): Promise<Organization[]> {
    return this.db
      .select()
      .from(organizations)
      .where(eq(organizations.ownerId, ownerId));
  }

  async update(
    id: string,
    data: Partial<NewOrganization>,
  ): Promise<Organization | null> {
    const [updated] = await this.db
      .update(organizations)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(organizations.id, id))
      .returning();
    return updated || null;
  }

  async delete(id: string): Promise<boolean> {
    const [deleted] = await this.db
      .delete(organizations)
      .where(eq(organizations.id, id))
      .returning({ id: organizations.id });
    return !!deleted;
  }

  async findAllActive(
    limit?: number,
    offset?: number,
  ): Promise<Organization[]> {
    let query = this.db
      .select()
      .from(organizations)
      .where(eq(organizations.flActive, true))
      .orderBy(desc(organizations.createdAt))
      .$dynamic();

    if (limit !== undefined && offset !== undefined) {
      query = query.limit(limit).offset(offset);
    }

    return query;
  }

  async findAllActiveByMember(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<Organization[]> {
    let query = this.db
      .select({
        id: organizations.id,
        name: organizations.name,
        slug: organizations.slug,
        ownerId: organizations.ownerId,
        settings: organizations.settings,
        createdAt: organizations.createdAt,
        updatedAt: organizations.updatedAt,
        flActive: organizations.flActive,
      })
      .from(organizations)
      .innerJoin(
        organizationMembers,
        eq(organizationMembers.organizationId, organizations.id),
      )
      .where(
        and(
          eq(organizations.flActive, true),
          eq(organizationMembers.flActive, true),
          eq(organizations.ownerId, userId),
          eq(organizationMembers.userId, userId),
        ),
      )
      .orderBy(desc(organizations.createdAt))
      .$dynamic();

    if (limit !== undefined && offset !== undefined) {
      query = query.limit(limit).offset(offset);
    }

    return query;
  }

  async searchByName(name: string): Promise<Organization[]> {
    return this.db
      .select()
      .from(organizations)
      .where(
        and(
          eq(organizations.flActive, true),
          like(organizations.name, `%${name}%`),
        ),
      );
  }

  async countUserOrganizations(userId: string): Promise<number> {
    const [result] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(organizations)
      .where(eq(organizations.ownerId, userId));
    return result?.count || 0;
  }
}
