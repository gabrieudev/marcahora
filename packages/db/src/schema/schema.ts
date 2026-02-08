import { pgTable, text, timestamp, index, unique, boolean, jsonb, foreignKey, uniqueIndex, uuid, integer, doublePrecision, check, bigint, pgMaterializedView, numeric, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const eventStatus = pgEnum("event_status", ['draft', 'published', 'cancelled', 'archived'])
export const notificationStatus = pgEnum("notification_status", ['pending', 'sent', 'failed', 'cancelled'])
export const notificationType = pgEnum("notification_type", ['email', 'push', 'sms', 'webhook'])
export const orgRole = pgEnum("org_role", ['admin', 'organizador', 'membro'])
export const paymentStatus = pgEnum("payment_status", ['pending', 'paid', 'failed', 'refunded', 'cancelled'])
export const reservationStatus = pgEnum("reservation_status", ['reserved', 'paid', 'cancelled', 'expired', 'checked_in'])
export const ticketVisibility = pgEnum("ticket_visibility", ['visible', 'hidden'])
export const userStatus = pgEnum("user_status", ['active', 'suspended', 'deleted', 'invited'])


export const systemLocks = pgTable("system_locks", {
	key: text().primaryKey().notNull(),
	owner: text(),
	acquiredAt: timestamp("acquired_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").default(false),
	image: text(),
	lastSigninAt: timestamp("last_signin_at", { withTimezone: true, mode: 'string' }),
	status: userStatus().default('active'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	profile: jsonb().default({}),
}, (table) => [
	index("idx_users_email").using("btree", sql`lower(email)`),
	index("idx_users_last_signin_at").using("btree", table.lastSigninAt.asc().nullsLast().op("timestamptz_ops")),
	unique("users_email_key").on(table.email),
]);

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	index("session_userid_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "session_user_id_fkey"
		}).onDelete("cascade"),
	unique("session_token_key").on(table.token),
]);

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true, mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true, mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("account_userid_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "account_user_id_fkey"
		}).onDelete("cascade"),
]);

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("verification_identifier_idx").using("btree", table.identifier.asc().nullsLast().op("text_ops")),
]);

export const organizations = pgTable("organizations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	ownerId: text("owner_id").notNull(),
	settings: jsonb().default({}),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	flActive: boolean("fl_active").default(true),
}, (table) => [
	uniqueIndex("idx_organizations_slug").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [users.id],
			name: "organizations_owner_id_fkey"
		}).onDelete("set null"),
]);

export const organizationMembers = pgTable("organization_members", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	userId: text("user_id").notNull(),
	role: orgRole().default('membro').notNull(),
	joinedAt: timestamp("joined_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	isOwner: boolean("is_owner").default(false),
	preferences: jsonb().default({}),
	flActive: boolean("fl_active").default(true),
}, (table) => [
	index("idx_org_members_org").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	index("idx_org_members_user").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizations.id],
			name: "organization_members_organization_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "organization_members_user_id_fkey"
		}).onDelete("cascade"),
	unique("organization_members_organization_id_user_id_key").on(table.organizationId, table.userId),
]);

export const events = pgTable("events", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id"),
	organizerId: text("organizer_id"),
	title: text().notNull(),
	slug: text().notNull(),
	description: text(),
	shortDescription: text("short_description"),
	type: text(),
	venueId: uuid("venue_id"),
	startAt: timestamp("start_at", { withTimezone: true, mode: 'string' }).notNull(),
	endAt: timestamp("end_at", { withTimezone: true, mode: 'string' }),
	capacityTotal: integer("capacity_total"),
	status: eventStatus().default('draft'),
	isPublic: boolean("is_public").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	metadata: jsonb().default({}),
}, (table) => [
	index("idx_events_search").using("gin", sql`to_tsvector('portuguese'::regconfig, ((((COALESCE(title, ''::te`),
	uniqueIndex("idx_events_slug_org").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops"), table.slug.asc().nullsLast().op("text_ops")),
	index("idx_events_start_at").using("btree", table.startAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_events_status").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizations.id],
			name: "events_organization_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.organizerId],
			foreignColumns: [users.id],
			name: "events_organizer_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.venueId],
			foreignColumns: [venues.id],
			name: "events_venue_id_fkey"
		}),
]);

export const venues = pgTable("venues", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id"),
	name: text().notNull(),
	address: text(),
	capacity: integer(),
	latitude: doublePrecision(),
	longitude: doublePrecision(),
	metadata: jsonb().default({}),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_venues_lat_lng").using("btree", table.latitude.asc().nullsLast().op("float8_ops"), table.longitude.asc().nullsLast().op("float8_ops")),
	index("idx_venues_org").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizations.id],
			name: "venues_organization_id_fkey"
		}).onDelete("set null"),
]);

export const ticketTypes = pgTable("ticket_types", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	eventId: uuid("event_id").notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	description: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	priceCents: bigint("price_cents", { mode: "number" }).default(0),
	quota: integer().notNull(),
	sold: integer().default(0).notNull(),
	salesStart: timestamp("sales_start", { withTimezone: true, mode: 'string' }),
	salesEnd: timestamp("sales_end", { withTimezone: true, mode: 'string' }),
	visible: ticketVisibility().default('visible'),
	maxPerOrder: integer("max_per_order").default(10),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	metadata: jsonb().default({}),
}, (table) => [
	index("idx_ticket_types_available").using("btree", table.eventId.asc().nullsLast().op("uuid_ops")).where(sql`(sold < quota)`),
	index("idx_ticket_types_event").using("btree", table.eventId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("idx_ticket_types_event_slug").using("btree", table.eventId.asc().nullsLast().op("text_ops"), table.slug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "ticket_types_event_id_fkey"
		}).onDelete("cascade"),
	check("ticket_types_check", sql`(quota >= 0) AND (sold >= 0) AND (sold <= quota)`),
]);

export const reservations = pgTable("reservations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	eventId: uuid("event_id").notNull(),
	ticketTypeId: uuid("ticket_type_id").notNull(),
	userId: text("user_id"),
	guestEmail: text("guest_email"),
	quantity: integer().notNull(),
	status: reservationStatus().default('reserved').notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalAmountCents: bigint("total_amount_cents", { mode: "number" }).notNull(),
	paymentId: uuid("payment_id"),
	reservationCode: text("reservation_code").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }),
	checkedInAt: timestamp("checked_in_at", { withTimezone: true, mode: 'string' }),
	checkinDevice: text("checkin_device"),
	metadata: jsonb().default({}),
}, (table) => [
	index("idx_reservations_event").using("btree", table.eventId.asc().nullsLast().op("uuid_ops")),
	index("idx_reservations_expires_at").using("btree", table.expiresAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_reservations_status").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("idx_reservations_ticket_type").using("btree", table.ticketTypeId.asc().nullsLast().op("uuid_ops")),
	index("idx_reservations_user").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "reservations_event_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.ticketTypeId],
			foreignColumns: [ticketTypes.id],
			name: "reservations_ticket_type_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "reservations_user_id_fkey"
		}).onDelete("set null"),
	unique("reservations_reservation_code_key").on(table.reservationCode),
	check("reservations_quantity_check", sql`quantity > 0`),
	check("reservations_user_or_email", sql`(user_id IS NOT NULL) OR ((guest_email IS NOT NULL) AND (guest_email <> ''::text))`),
]);

export const payments = pgTable("payments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	reservationId: uuid("reservation_id"),
	provider: text(),
	providerPaymentId: text("provider_payment_id"),
	status: paymentStatus().default('pending').notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	amountCents: bigint("amount_cents", { mode: "number" }).notNull(),
	currency: text().default('BRL'),
	paidAt: timestamp("paid_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	metadata: jsonb().default({}),
}, (table) => [
	index("idx_payments_provider_id").using("btree", table.provider.asc().nullsLast().op("text_ops"), table.providerPaymentId.asc().nullsLast().op("text_ops")),
	index("idx_payments_reservation").using("btree", table.reservationId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.reservationId],
			foreignColumns: [reservations.id],
			name: "payments_reservation_id_fkey"
		}).onDelete("set null"),
]);

export const waitlistEntries = pgTable("waitlist_entries", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	eventId: uuid("event_id").notNull(),
	ticketTypeId: uuid("ticket_type_id"),
	userId: text("user_id"),
	email: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	notifiedAt: timestamp("notified_at", { withTimezone: true, mode: 'string' }),
	status: text().default('waiting'),
	metadata: jsonb().default({}),
}, (table) => [
	index("idx_waitlist_event").using("btree", table.eventId.asc().nullsLast().op("uuid_ops")),
	index("idx_waitlist_ticket_type").using("btree", table.ticketTypeId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "waitlist_entries_event_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.ticketTypeId],
			foreignColumns: [ticketTypes.id],
			name: "waitlist_entries_ticket_type_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "waitlist_entries_user_id_fkey"
		}).onDelete("set null"),
]);

export const notifications = pgTable("notifications", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id"),
	type: notificationType().notNull(),
	channel: text(),
	payload: jsonb().notNull(),
	scheduledAt: timestamp("scheduled_at", { withTimezone: true, mode: 'string' }),
	sentAt: timestamp("sent_at", { withTimezone: true, mode: 'string' }),
	status: notificationStatus().default('pending'),
	attempts: integer().default(0),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_notifications_scheduled").using("btree", table.scheduledAt.asc().nullsLast().op("timestamptz_ops")).where(sql`(status = 'pending'::notification_status)`),
	index("idx_notifications_user").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "notifications_user_id_fkey"
		}).onDelete("set null"),
]);

export const checkins = pgTable("checkins", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	reservationId: uuid("reservation_id"),
	checkedInAt: timestamp("checked_in_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	checkedInBy: text("checked_in_by"),
	deviceInfo: text("device_info"),
	metadata: jsonb().default({}),
}, (table) => [
	index("idx_checkins_reservation").using("btree", table.reservationId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.reservationId],
			foreignColumns: [reservations.id],
			name: "checkins_reservation_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.checkedInBy],
			foreignColumns: [users.id],
			name: "checkins_checked_in_by_fkey"
		}),
]);

export const auditLogs = pgTable("audit_logs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	actorId: text("actor_id"),
	action: text().notNull(),
	targetType: text("target_type"),
	targetId: text("target_id"),
	metadata: jsonb().default({}),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_audit_logs_actor").using("btree", table.actorId.asc().nullsLast().op("text_ops")),
	index("idx_audit_logs_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.actorId],
			foreignColumns: [users.id],
			name: "audit_logs_actor_id_fkey"
		}),
]);
export const mvEventOccupancy = pgMaterializedView("mv_event_occupancy", {	eventId: uuid("event_id"),
	title: text(),
	startAt: timestamp("start_at", { withTimezone: true, mode: 'string' }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	reservedTotal: bigint("reserved_total", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	capacityTotal: bigint("capacity_total", { mode: "number" }),
	pctOccupancy: numeric("pct_occupancy"),
}).as(sql`SELECT e.id AS event_id, e.title, e.start_at, sum(r.quantity) FILTER (WHERE r.status = ANY (ARRAY['reserved'::reservation_status, 'paid'::reservation_status, 'checked_in'::reservation_status])) AS reserved_total, COALESCE(e.capacity_total::bigint, sum(tt.quota)) AS capacity_total, round( CASE WHEN COALESCE(e.capacity_total::bigint, sum(tt.quota)) > 0 THEN 100.0 * sum(r.quantity) FILTER (WHERE r.status = ANY (ARRAY['reserved'::reservation_status, 'paid'::reservation_status, 'checked_in'::reservation_status]))::numeric / COALESCE(e.capacity_total::bigint, sum(tt.quota))::numeric ELSE 0::numeric END, 2) AS pct_occupancy FROM events e LEFT JOIN ticket_types tt ON tt.event_id = e.id LEFT JOIN reservations r ON r.event_id = e.id GROUP BY e.id, e.title, e.start_at, e.capacity_total`);