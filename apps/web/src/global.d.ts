export {};

declare global {
  interface User {
    id?: string | null;
    name: string;
    email: string;
    email_verified?: boolean | null;
    image?: string | null;
    last_signin_at?: string | null;
    status?: "active" | "suspended" | "deleted" | "invited" | null;
    created_at?: string | null;
    updated_at?: string | null;
    profile?: any | null;
  }

  interface Session {
    id?: string | null;
    expires_at: string;
    token: string;
    created_at: string;
    updated_at: string;
    ip_address?: string | null;
    user_agent?: string | null;
    user_id: string;
  }

  interface Account {
    id?: string | null;
    account_id: string;
    provider_id: string;
    user_id: string;
    access_token?: string | null;
    refresh_token?: string | null;
    id_token?: string | null;
    access_token_expires_at?: string | null;
    refresh_token_expires_at?: string | null;
    scope?: string | null;
    password?: string | null;
    created_at: string;
    updated_at: string;
  }

  interface Verification {
    id?: string | null;
    identifier: string;
    value: string;
    expires_at: string;
    created_at: string;
    updated_at: string;
  }

  interface Organization {
    id?: string | null;
    name: string;
    slug: string;
    owner_id: string;
    settings?: any | null;
    created_at?: string | null;
    updated_at?: string | null;
    fl_active?: boolean | null;
  }

  interface OrganizationMember {
    id?: string | null;
    organization_id: string;
    user_id: string;
    role: "admin" | "organizador" | "membro";
    joined_at?: string | null;
    is_owner?: boolean | null;
    preferences?: any | null;
    fl_active?: boolean | null;
    user?: User | null;
    organization?: Organization | null;
  }

  interface Venue {
    id?: string | null;
    organization_id?: string | null;
    name: string;
    address?: string | null;
    capacity?: number | null;
    latitude?: number | null;
    longitude?: number | null;
    metadata?: any | null;
    created_at?: string | null;
  }

  interface Event {
    id?: string | null;
    organization_id?: string | null;
    organizer_id?: string | null;
    title: string;
    slug: string;
    description?: string | null;
    short_description?: string | null;
    type?: string | null;
    venue_id?: string | null;
    start_at: string;
    end_at?: string | null;
    capacity_total?: number | null;
    status?: "draft" | "published" | "cancelled" | "archived" | null;
    is_public?: boolean | null;
    created_at?: string | null;
    updated_at?: string | null;
    metadata?: any | null;
  }

  interface TicketType {
    id?: string | null;
    event_id: string;
    name: string;
    slug: string;
    description?: string | null;
    price_cents?: number | null;
    quota: number;
    sold: number;
    sales_start?: string | null;
    sales_end?: string | null;
    visible?: "visible" | "hidden" | null;
    max_per_order?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
    metadata?: any | null;
  }

  interface Reservation {
    id?: string | null;
    event_id: string;
    ticket_type_id: string;
    user_id?: string | null;
    guest_email?: string | null;
    quantity: number;
    status: "reserved" | "paid" | "cancelled" | "expired" | "checked_in";
    total_amount_cents: number;
    payment_id?: string | null;
    reservation_code: string;
    created_at?: string | null;
    expires_at?: string | null;
    metadata?: any | null;
  }

  interface Payment {
    id?: string | null;
    reservation_id?: string | null;
    provider?: string | null;
    provider_payment_id?: string | null;
    status: "pending" | "paid" | "failed" | "refunded" | "cancelled";
    amount_cents: number;
    currency?: string | null;
    paid_at?: string | null;
    created_at?: string | null;
    metadata?: any | null;
  }

  interface WaitlistEntry {
    id?: string | null;
    event_id: string;
    ticket_type_id?: string | null;
    user_id?: string | null;
    email?: string | null;
    created_at?: string | null;
    notified_at?: string | null;
    status?: string | null;
    metadata?: any | null;
  }

  interface Notification {
    id?: string | null;
    user_id?: string | null;
    type: "email" | "push" | "sms" | "webhook";
    channel?: string | null;
    payload: any;
    scheduled_at?: string | null;
    sent_at?: string | null;
    status?: "pending" | "sent" | "failed" | "cancelled" | null;
    attempts?: number | null;
    created_at?: string | null;
  }

  interface Checkin {
    id?: string | null;
    reservation_id?: string | null;
    device_info?: string | null;
    metadata?: any | null;
  }

  interface AuditLog {
    id?: string | null;
    actor_id?: string | null;
    action: string;
    target_type?: string | null;
    target_id?: string | null;
    metadata?: any | null;
    created_at?: string | null;
  }

  interface SystemLock {
    key?: string | null;
    owner?: string | null;
    acquired_at?: string | null;
  }
}

export {};
