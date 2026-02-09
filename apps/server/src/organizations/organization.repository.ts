import { organizations } from "@marcahora/db/schema/schema";
import { Inject, Injectable } from "@nestjs/common";
import { and, desc, eq, like, sql } from "drizzle-orm";
import type { NewOrganization, Organization } from "./organization.schema";
import type { NeonDatabase } from "drizzle-orm/neon-serverless";
import { DRIZZLE_DB } from "@/shared/database/database.constants";

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

  async findAllActive(limit = 50, offset = 0): Promise<Organization[]> {
    return this.db
      .select()
      .from(organizations)
      .where(eq(organizations.flActive, true))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(organizations.createdAt));
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
