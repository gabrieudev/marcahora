import { organizationMembers } from "@marcahora/db/schema/schema";
import { createSelectSchema } from "drizzle-zod";

export const selectMemberSchema = createSelectSchema(organizationMembers);
export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type NewOrganizationMember = typeof organizationMembers.$inferInsert;
