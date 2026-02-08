import { relations } from "drizzle-orm/relations";
import { users, session, account, organizations, organizationMembers, events, venues, ticketTypes, reservations, payments, waitlistEntries, notifications, checkins, auditLogs } from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
	user: one(users, {
		fields: [session.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	sessions: many(session),
	accounts: many(account),
	organizations: many(organizations),
	organizationMembers: many(organizationMembers),
	events: many(events),
	reservations: many(reservations),
	waitlistEntries: many(waitlistEntries),
	notifications: many(notifications),
	checkins: many(checkins),
	auditLogs: many(auditLogs),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(users, {
		fields: [account.userId],
		references: [users.id]
	}),
}));

export const organizationsRelations = relations(organizations, ({one, many}) => ({
	user: one(users, {
		fields: [organizations.ownerId],
		references: [users.id]
	}),
	organizationMembers: many(organizationMembers),
	events: many(events),
	venues: many(venues),
}));

export const organizationMembersRelations = relations(organizationMembers, ({one}) => ({
	organization: one(organizations, {
		fields: [organizationMembers.organizationId],
		references: [organizations.id]
	}),
	user: one(users, {
		fields: [organizationMembers.userId],
		references: [users.id]
	}),
}));

export const eventsRelations = relations(events, ({one, many}) => ({
	organization: one(organizations, {
		fields: [events.organizationId],
		references: [organizations.id]
	}),
	user: one(users, {
		fields: [events.organizerId],
		references: [users.id]
	}),
	venue: one(venues, {
		fields: [events.venueId],
		references: [venues.id]
	}),
	ticketTypes: many(ticketTypes),
	reservations: many(reservations),
	waitlistEntries: many(waitlistEntries),
}));

export const venuesRelations = relations(venues, ({one, many}) => ({
	events: many(events),
	organization: one(organizations, {
		fields: [venues.organizationId],
		references: [organizations.id]
	}),
}));

export const ticketTypesRelations = relations(ticketTypes, ({one, many}) => ({
	event: one(events, {
		fields: [ticketTypes.eventId],
		references: [events.id]
	}),
	reservations: many(reservations),
	waitlistEntries: many(waitlistEntries),
}));

export const reservationsRelations = relations(reservations, ({one, many}) => ({
	event: one(events, {
		fields: [reservations.eventId],
		references: [events.id]
	}),
	ticketType: one(ticketTypes, {
		fields: [reservations.ticketTypeId],
		references: [ticketTypes.id]
	}),
	user: one(users, {
		fields: [reservations.userId],
		references: [users.id]
	}),
	payments: many(payments),
	checkins: many(checkins),
}));

export const paymentsRelations = relations(payments, ({one}) => ({
	reservation: one(reservations, {
		fields: [payments.reservationId],
		references: [reservations.id]
	}),
}));

export const waitlistEntriesRelations = relations(waitlistEntries, ({one}) => ({
	event: one(events, {
		fields: [waitlistEntries.eventId],
		references: [events.id]
	}),
	ticketType: one(ticketTypes, {
		fields: [waitlistEntries.ticketTypeId],
		references: [ticketTypes.id]
	}),
	user: one(users, {
		fields: [waitlistEntries.userId],
		references: [users.id]
	}),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	user: one(users, {
		fields: [notifications.userId],
		references: [users.id]
	}),
}));

export const checkinsRelations = relations(checkins, ({one}) => ({
	reservation: one(reservations, {
		fields: [checkins.reservationId],
		references: [reservations.id]
	}),
	user: one(users, {
		fields: [checkins.checkedInBy],
		references: [users.id]
	}),
}));

export const auditLogsRelations = relations(auditLogs, ({one}) => ({
	user: one(users, {
		fields: [auditLogs.actorId],
		references: [users.id]
	}),
}));