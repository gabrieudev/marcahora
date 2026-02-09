import { organizations } from "@marcahora/db/schema/schema";
import { createSelectSchema } from "drizzle-zod";

export const selectOrganizationSchema = createSelectSchema(organizations);
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
