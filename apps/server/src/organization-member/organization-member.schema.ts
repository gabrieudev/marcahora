import {
  organizationMembers,
  users,
  organizations,
} from "@marcahora/db/schema/schema";
import { createSelectSchema } from "drizzle-zod";

export const selectMemberSchema = createSelectSchema(organizationMembers);
export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type NewOrganizationMember = typeof organizationMembers.$inferInsert;
export type UserOrganizationMember = OrganizationMember & {
  user?: typeof users.$inferSelect | null;
  organization?: typeof organizations.$inferSelect | null;
};
