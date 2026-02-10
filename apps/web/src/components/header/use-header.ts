"use client";

import useOrganizationId from "@/hooks/use-organization-id";
import api from "@/lib/api";
import { useSession } from "@/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Bell,
  Building2,
  Calendar,
  CalendarDays,
  CheckCircle,
  ClipboardList,
  CreditCard,
  DollarSign,
  Home,
  Layers,
  MapPin,
  Plug,
  RefreshCw,
  Settings,
  Shield,
  Tag,
  Ticket,
  UserPlus,
  Users,
} from "lucide-react";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface NavItem {
  label: string;
  href: Route | string;
  icon: React.ComponentType<any>;
  permission?: ("admin" | "organizador" | "membro")[];
  requiresOrganization?: boolean;
  subItems?: NavItem[];
}

const globalRoutes: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Minhas Organizações",
    href: "/organizations",
    icon: Building2,
  },
  {
    label: "Meus Eventos",
    href: "/events",
    icon: Calendar,
  },
  {
    label: "Minhas Reservas",
    href: "/reservations",
    icon: Ticket,
  },
  {
    label: "Pagamentos",
    href: "/payments",
    icon: CreditCard,
  },
  {
    label: "Relatórios",
    href: "/reports",
    icon: BarChart3,
  },
];

export default function useHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { session, signOut } = useSession();
  const { currentOrganizationId, handleOrganizationChange } =
    useOrganizationId();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: myMemberships, isLoading: isLoadingMyMemberships } = useQuery<
    OrganizationMember[]
  >({
    queryKey: ["organizationMembers", currentOrganizationId],
    queryFn: async () => {
      if (!currentOrganizationId) return [];
      const { data } = await api.get(
        `/organizations/${currentOrganizationId}/members`,
      );
      return data;
    },
    enabled: !!currentOrganizationId,
  });

  const currentOrganization = myMemberships?.find(
    (membership) => membership.organization?.id === currentOrganizationId,
  )?.organization;

  const currentOrgMembership = myMemberships?.find(
    (membership) => membership.organization?.id === currentOrganizationId,
  );

  const orgRoutes: NavItem[] = currentOrganization
    ? [
        {
          label: "Visão Geral",
          href: `/org/${currentOrganization.slug}/dashboard`,
          icon: Home,
          permission: ["admin", "organizador", "membro"],
        },
        {
          label: "Eventos",
          href: `/org/${currentOrganization.slug}/events`,
          icon: Calendar,
          permission: ["admin", "organizador"],
          subItems: [
            {
              label: "Todos Eventos",
              href: `/org/${currentOrganization.slug}/events`,
              icon: Calendar,
            },
            {
              label: "Calendário",
              href: `/org/${currentOrganization.slug}/events/calendar`,
              icon: CalendarDays,
            },
          ],
        },
        {
          label: "Ingressos",
          href: `/org/${currentOrganization.slug}/tickets`,
          icon: Ticket,
          permission: ["admin", "organizador"],
          subItems: [
            {
              label: "Tipos de Ingresso",
              href: `/org/${currentOrganization.slug}/ticket-types`,
              icon: Ticket,
            },
            {
              label: "Lotes",
              href: `/org/${currentOrganization.slug}/ticket-batches`,
              icon: Layers,
            },
            {
              label: "Preços",
              href: `/org/${currentOrganization.slug}/pricing`,
              icon: Tag,
            },
          ],
        },
        {
          label: "Reservas",
          href: `/org/${currentOrganization.slug}/reservations`,
          icon: ClipboardList,
          permission: ["admin", "organizador"],
          subItems: [
            {
              label: "Todas Reservas",
              href: `/org/${currentOrganization.slug}/reservations`,
              icon: ClipboardList,
            },
            {
              label: "Check-in",
              href: `/org/${currentOrganization.slug}/checkins`,
              icon: CheckCircle,
            },
            {
              label: "Fila de Espera",
              href: `/org/${currentOrganization.slug}/waitlist`,
              icon: Users,
            },
          ],
        },
        {
          label: "Financeiro",
          href: `/org/${currentOrganization.slug}/financial`,
          icon: DollarSign,
          permission: ["admin"],
          subItems: [
            {
              label: "Pagamentos",
              href: `/org/${currentOrganization.slug}/payments`,
              icon: CreditCard,
            },
            {
              label: "Relatórios",
              href: `/org/${currentOrganization.slug}/financial/reports`,
              icon: BarChart3,
            },
            {
              label: "Reembolsos",
              href: `/org/${currentOrganization.slug}/refunds`,
              icon: RefreshCw,
            },
          ],
        },
        {
          label: "Locais",
          href: `/org/${currentOrganization.slug}/venues`,
          icon: MapPin,
          permission: ["admin", "organizador"],
        },
        {
          label: "Membros",
          href: `/org/${currentOrganization.slug}/members`,
          icon: Users,
          permission: ["admin"],
          subItems: [
            {
              label: "Todos Membros",
              href: `/org/${currentOrganization.slug}/members`,
              icon: Users,
            },
            {
              label: "Convites",
              href: `/org/${currentOrganization.slug}/members/invites`,
              icon: UserPlus,
            },
            {
              label: "Permissões",
              href: `/org/${currentOrganization.slug}/members/permissions`,
              icon: Shield,
            },
          ],
        },
        {
          label: "Configurações",
          href: `/org/${currentOrganization.slug}/settings`,
          icon: Settings,
          permission: ["admin"],
          subItems: [
            {
              label: "Geral",
              href: `/org/${currentOrganization.slug}/settings/general`,
              icon: Settings,
            },
            {
              label: "Notificações",
              href: `/org/${currentOrganization.slug}/settings/notifications`,
              icon: Bell,
            },
            {
              label: "Integrações",
              href: `/org/${currentOrganization.slug}/settings/integrations`,
              icon: Plug,
            },
          ],
        },
      ]
    : [];

  const filteredRoutes = currentOrganization ? orgRoutes : globalRoutes;

  const hasPermission = (item: NavItem) => {
    if (!item.permission) return true;
    if (!currentOrganization) return false;

    const userRole = myMemberships?.find(
      (membership) => membership.organization?.id === currentOrganization.id,
    )?.role;
    return userRole ? item.permission.includes(userRole) : false;
  };

  return {
    pathname,
    signOut,
    session,
    mobileMenuOpen,
    setMobileMenuOpen,
    handleOrganizationChange,
    currentOrganization,
    filteredRoutes,
    myMemberships,
    isLoadingMyMemberships,
    hasPermission,
    currentOrgMembership,
    router,
  };
}
