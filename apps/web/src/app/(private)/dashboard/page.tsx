"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  MoreVertical,
  PieChart,
  Plus,
  Settings,
  Ticket,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Tipos baseados no schema
interface DashboardStats {
  totalEvents: number;
  totalRevenue: number;
  totalTicketsSold: number;
  totalAttendees: number;
  upcomingEvents: number;
  pendingReservations: number;
  occupancyRate: number;
  checkinRate: number;
}

interface RecentEvent {
  id: string;
  title: string;
  start_at: string;
  status: "draft" | "published" | "cancelled" | "archived";
  slug: string;
  reserved_total: number;
  capacity_total: number;
  pct_occupancy: number;
}

interface RecentReservation {
  id: string;
  event_title: string;
  user_name: string;
  quantity: number;
  total_amount_cents: number;
  status: "reserved" | "paid" | "cancelled" | "expired" | "checked_in";
  created_at: string;
  reservation_code: string;
}

interface RevenueData {
  date: string;
  revenue: number;
  tickets: number;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [recentReservations, setRecentReservations] = useState<
    RecentReservation[]
  >([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);

  // Mock data - em produção isso viria da API
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentOrg({
        id: "1",
        name: "Tech Events Corp",
        slug: "tech-events-corp",
      });

      setStats({
        totalEvents: 42,
        totalRevenue: 1250000, // em centavos (R$ 12.500,00)
        totalTicketsSold: 1250,
        totalAttendees: 980,
        upcomingEvents: 8,
        pendingReservations: 23,
        occupancyRate: 78,
        checkinRate: 92,
      });

      setRecentEvents([
        {
          id: "1",
          title: "Tech Conference 2024",
          start_at: "2024-06-15T10:00:00Z",
          status: "published",
          slug: "tech-conference-2024",
          reserved_total: 150,
          capacity_total: 200,
          pct_occupancy: 75,
        },
        {
          id: "2",
          title: "Workshop de React Avançado",
          start_at: "2024-06-10T14:00:00Z",
          status: "published",
          slug: "workshop-react-avancado",
          reserved_total: 30,
          capacity_total: 50,
          pct_occupancy: 60,
        },
        {
          id: "3",
          title: "Meetup de Startups",
          start_at: "2024-06-20T18:00:00Z",
          status: "draft",
          slug: "meetup-startups",
          reserved_total: 0,
          capacity_total: 100,
          pct_occupancy: 0,
        },
        {
          id: "4",
          title: "Lançamento do Produto X",
          start_at: "2024-07-01T09:00:00Z",
          status: "published",
          slug: "lancamento-produto-x",
          reserved_total: 80,
          capacity_total: 150,
          pct_occupancy: 53.3,
        },
      ]);

      setRecentReservations([
        {
          id: "101",
          event_title: "Tech Conference 2024",
          user_name: "João Silva",
          quantity: 2,
          total_amount_cents: 40000,
          status: "paid",
          created_at: "2024-05-20T14:30:00Z",
          reservation_code: "TC24-ABC123",
        },
        {
          id: "102",
          event_title: "Workshop de React Avançado",
          user_name: "Maria Santos",
          quantity: 1,
          total_amount_cents: 15000,
          status: "reserved",
          created_at: "2024-05-21T10:15:00Z",
          reservation_code: "WR24-XYZ789",
        },
        {
          id: "103",
          event_title: "Meetup de Startups",
          user_name: "Carlos Oliveira",
          quantity: 4,
          total_amount_cents: 0,
          status: "cancelled",
          created_at: "2024-05-18T16:45:00Z",
          reservation_code: "MS24-DEF456",
        },
        {
          id: "104",
          event_title: "Tech Conference 2024",
          user_name: "Ana Costa",
          quantity: 3,
          total_amount_cents: 60000,
          status: "paid",
          created_at: "2024-05-22T09:30:00Z",
          reservation_code: "TC24-GHI789",
        },
      ]);

      // Gerar dados mockados de receita
      const today = new Date();
      const data: RevenueData[] = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        data.push({
          date: date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
          }),
          revenue: Math.floor(Math.random() * 50000) + 10000,
          tickets: Math.floor(Math.random() * 20) + 5,
        });
      }
      setRevenueData(data);

      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "secondary",
      published: "default",
      cancelled: "destructive",
      archived: "outline",
      reserved: "outline",
      paid: "default",
      expired: "secondary",
      checked_in: "success",
    };

    const labels = {
      draft: "Rascunho",
      published: "Publicado",
      cancelled: "Cancelado",
      archived: "Arquivado",
      reserved: "Reservado",
      paid: "Pago",
      expired: "Expirado",
      checked_in: "Check-in",
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center px-4 py-8">
        <div className="grid w-full max-w-6xl gap-6">
          <Skeleton className="mx-auto h-8 w-48" />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-80 lg:col-span-2" />
            <Skeleton className="h-80" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard {currentOrg && `• ${currentOrg.name}`}
            </h1>
            <p className="text-muted-foreground mt-2">
              Visão geral das suas organizações, eventos e vendas
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-38">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                <SelectItem value="1y">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Evento
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6"
      >
        {/* Cards de Métricas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Receita Total
                </CardTitle>
                <div className="rounded-full bg-primary/10 p-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats?.totalRevenue || 0)}
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">+12.5%</span> em relação ao
                  mês passado
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ingressos Vendidos
                </CardTitle>
                <div className="rounded-full bg-blue-500/10 p-2">
                  <Ticket className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalTicketsSold}
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">+8.2%</span> em relação ao
                  mês passado
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Taxa de Ocupação
                </CardTitle>
                <div className="rounded-full bg-green-500/10 p-2">
                  <PieChart className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.occupancyRate}%
                </div>
                <Progress value={stats?.occupancyRate} className="mt-2 h-2" />
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  <Eye className="mr-1 h-3 w-3" />
                  <span>{stats?.totalAttendees} participantes</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Eventos Ativos
                </CardTitle>
                <div className="rounded-full bg-purple-500/10 p-2">
                  <Calendar className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.upcomingEvents}
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>{stats?.pendingReservations} reservas pendentes</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Gráficos e Tabelas */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Receita Diária</CardTitle>
              <CardDescription>
                Receita e ingressos vendidos nos últimos 30 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {/* Aqui viria um gráfico real (Recharts, Chart.js, etc) */}
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
                  <div className="text-center">
                    <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Gráfico de receita diária
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {revenueData.length} pontos de dados disponíveis
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status dos Eventos</CardTitle>
              <CardDescription>Distribuição por status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { status: "published", count: 8, color: "bg-green-500" },
                  { status: "draft", count: 3, color: "bg-yellow-500" },
                  { status: "cancelled", count: 1, color: "bg-red-500" },
                  { status: "archived", count: 2, color: "bg-gray-500" },
                ].map((item) => (
                  <div key={item.status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm capitalize">{item.status}</span>
                      <span className="text-sm font-medium">{item.count}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${(item.count / 14) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between rounded-lg bg-muted p-4">
                <div>
                  <p className="text-sm font-medium">Taxa de Check-in</p>
                  <p className="text-2xl font-bold">{stats?.checkinRate}%</p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Eventos e Reservas Recentes */}
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="h-4 w-4" />
              Eventos Recentes
            </TabsTrigger>
            <TabsTrigger value="reservations" className="gap-2">
              <Ticket className="h-4 w-4" />
              Reservas Recentes
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Activity className="h-4 w-4" />
              Atividade
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Próximos Eventos</CardTitle>
                <CardDescription>
                  Eventos com data de início nos próximos 30 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between rounded-lg border p-4 transition-all hover:shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-primary/10 p-3">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{event.title}</h4>
                            {getStatusBadge(event.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(event.start_at).toLocaleDateString(
                              "pt-BR",
                              {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm">
                              <span className="font-medium">
                                {event.reserved_total}
                              </span>
                              /{event.capacity_total} ingressos
                            </span>
                            <Progress
                              value={event.pct_occupancy}
                              className="w-24 h-2"
                            />
                            <span className="text-sm font-medium">
                              {event.pct_occupancy}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Activity className="mr-2 h-4 w-4" />
                            Relatórios
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            Participantes
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver todos os eventos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="reservations">
            <Card>
              <CardHeader>
                <CardTitle>Reservas Recentes</CardTitle>
                <CardDescription>Últimas 50 reservas criadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {reservation.user_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">
                              {reservation.user_name}
                            </h4>
                            {getStatusBadge(reservation.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {reservation.event_title} • {reservation.quantity}{" "}
                            ingresso(s)
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {reservation.reservation_code} •{" "}
                            {new Date(
                              reservation.created_at,
                            ).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(reservation.total_amount_cents)}
                        </p>
                        <p className="text-sm text-muted-foreground">Total</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver todas as reservas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>Ações recentes no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "Criou novo evento",
                      target: "Tech Conference 2024",
                      user: "João Silva",
                      time: "2 horas atrás",
                      icon: CheckCircle,
                      color: "text-green-500",
                    },
                    {
                      action: "Realizou check-in",
                      target: "Maria Santos",
                      user: "Sistema",
                      time: "4 horas atrás",
                      icon: Users,
                      color: "text-blue-500",
                    },
                    {
                      action: "Cancelou reserva",
                      target: "#MS24-DEF456",
                      user: "Carlos Oliveira",
                      time: "1 dia atrás",
                      icon: XCircle,
                      color: "text-red-500",
                    },
                    {
                      action: "Processou pagamento",
                      target: "R$ 600,00",
                      user: "Sistema Automático",
                      time: "2 dias atrás",
                      icon: DollarSign,
                      color: "text-green-500",
                    },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 border-b pb-4 last:border-0"
                    >
                      <div
                        className={`rounded-full p-2 ${activity.color} bg-opacity-10`}
                      >
                        <activity.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          <span className="text-foreground">
                            {activity.user}
                          </span>{" "}
                          <span className="text-muted-foreground">
                            {activity.action}
                          </span>{" "}
                          <span className="text-foreground">
                            {activity.target}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente funcionalidades importantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button
                variant="outline"
                className="h-auto flex-col items-center justify-center gap-2 p-6"
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <span className="font-medium">Criar Evento</span>
                <span className="text-xs text-muted-foreground">
                  Novo evento
                </span>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col items-center justify-center gap-2 p-6"
              >
                <div className="rounded-full bg-blue-500/10 p-3">
                  <BarChart3 className="h-6 w-6 text-blue-500" />
                </div>
                <span className="font-medium">Relatórios</span>
                <span className="text-xs text-muted-foreground">
                  Análises detalhadas
                </span>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col items-center justify-center gap-2 p-6"
              >
                <div className="rounded-full bg-green-500/10 p-3">
                  <Eye className="h-6 w-6 text-green-500" />
                </div>
                <span className="font-medium">Check-in</span>
                <span className="text-xs text-muted-foreground">
                  Registrar entrada
                </span>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col items-center justify-center gap-2 p-6"
              >
                <div className="rounded-full bg-purple-500/10 p-3">
                  <Settings className="h-6 w-6 text-purple-500" />
                </div>
                <span className="font-medium">Configurações</span>
                <span className="text-xs text-muted-foreground">
                  Organização
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
