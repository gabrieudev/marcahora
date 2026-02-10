"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Bell,
  Building2,
  ChevronDown,
  DollarSign,
  Eye,
  Home,
  LogOut,
  Menu,
  Plus,
  Settings,
  Ticket,
  User,
} from "lucide-react";
import Image from "next/image";
import useHeader from "./use-header";

export function MainHeader() {
  const {
    mobileMenuOpen,
    setMobileMenuOpen,
    handleOrganizationChange,
    currentOrganization,
    filteredRoutes,
    myMemberships,
    hasPermission,
    currentOrgMembership,
    isLoadingMyMemberships,
    router,
    session,
    signOut,
    pathname,
  } = useHeader();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b bg-linear-to-b from-background/95 to-background/85 backdrop-blur-xl supports-backdrop-filter:bg-background/70"
    >
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo e menu mobile */}
        <div className="flex items-center gap-3">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-70 sm:w-87.5 p-0">
              <div className="flex h-full flex-col">
                <SheetHeader className="border-b px-6 py-4">
                  <SheetTitle className="text-lg font-semibold">
                    Navegação
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="flex flex-col gap-1">
                    {filteredRoutes.filter(hasPermission).map((item) => (
                      <Button
                        key={item.href}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start rounded-lg px-3 py-2.5 transition-all hover:bg-accent/50",
                          pathname.startsWith(item.href) &&
                            "bg-primary/10 text-primary font-medium",
                        )}
                        onClick={() => {
                          router.push(item.href as any);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          <span className="text-sm">{item.label}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="hidden lg:block"
          >
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-lg font-semibold hover:bg-primary/5 mr-2"
              onClick={() => router.push("/dashboard")}
            >
              <div className="flex h-8 w-8 items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="MarcaHora"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
              </div>
              <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                MarcaHora
              </span>
            </Button>
          </motion.div>
        </div>

        {/* Navegação Desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {filteredRoutes.filter(hasPermission).map((item) => (
            <DropdownMenu key={item.href}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "group relative gap-2 rounded-lg px-3 py-2 transition-all",
                    pathname.startsWith(item.href)
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-accent/50 hover:text-foreground",
                  )}
                  onClick={() => router.push(item.href as any)}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 transition-transform group-hover:scale-110",
                      pathname.startsWith(item.href) && "text-primary",
                    )}
                  />
                  <span className="text-sm">{item.label}</span>
                  {item.subItems && (
                    <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                  )}
                  {pathname.startsWith(item.href) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-1/2 h-0.5 w-4/5 -translate-x-1/2 rounded-full bg-primary"
                    />
                  )}
                </Button>
              </DropdownMenuTrigger>
              {item.subItems && (
                <DropdownMenuContent
                  align="start"
                  className="mt-1 w-48 rounded-xl border shadow-lg"
                >
                  {item.subItems.map((subItem) => (
                    <DropdownMenuItem
                      key={subItem.href}
                      onClick={() => router.push(subItem.href as any)}
                      className="cursor-pointer rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/50"
                    >
                      <div className="flex items-center gap-2">
                        <subItem.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{subItem.label}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          ))}
        </nav>

        {/* Lado direito */}
        <div className="flex items-center gap-2">
          {/* Seletor da Organização */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="hidden sm:flex items-center gap-2 rounded-lg border-primary/20 px-3 py-2 hover:border-primary/40 hover:bg-primary/5 ml-2"
              >
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-primary/10 p-1">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  {currentOrganization ? (
                    <div className="flex items-center gap-2">
                      <span className="max-w-35 truncate text-sm font-medium">
                        {currentOrganization.name}
                      </span>
                      <div className="flex gap-1">
                        {currentOrgMembership?.is_owner && (
                          <Badge
                            variant="secondary"
                            className="rounded-full px-1.5 py-0 text-[10px]"
                          >
                            Owner
                          </Badge>
                        )}
                        <Badge
                          variant={
                            currentOrgMembership?.role === "admin"
                              ? "default"
                              : "outline"
                          }
                          className="rounded-full px-1.5 py-0 text-[10px]"
                        >
                          {currentOrgMembership?.role}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm">Selecionar Organização</span>
                  )}
                </div>
                <ChevronDown className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="mt-1 w-64 rounded-xl border shadow-lg"
            >
              <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Organizações
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {isLoadingMyMemberships ? (
                <div className="flex items-center justify-center px-3 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span className="text-sm text-muted-foreground">
                      Carregando...
                    </span>
                  </div>
                </div>
              ) : myMemberships?.length === 0 ? (
                <div className="flex items-center gap-2 px-3 py-4">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Nenhuma organização encontrada
                  </span>
                </div>
              ) : (
                <>
                  <div className="max-h-64 overflow-y-auto">
                    {myMemberships?.map((member) => (
                      <DropdownMenuItem
                        key={member.id}
                        onClick={() =>
                          handleOrganizationChange(
                            member.organization?.id ?? null,
                          )
                        }
                        className={cn(
                          "cursor-pointer rounded-lg px-3 py-3 transition-colors",
                          currentOrganization?.id ===
                            member?.organization?.id && "bg-primary/10",
                        )}
                      >
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-lg",
                                currentOrganization?.id ===
                                  member?.organization?.id
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary",
                              )}
                            >
                              <Building2 className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {member.organization?.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {member.role} •{" "}
                                {member.is_owner ? "Proprietário" : "Membro"}
                              </span>
                            </div>
                          </div>
                          {!member.organization?.fl_active && (
                            <Badge
                              variant="destructive"
                              className="rounded-full px-2 py-0 text-[10px]"
                            >
                              Inativa
                            </Badge>
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>

                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <DropdownMenuItem
                      onClick={() => {
                        handleOrganizationChange(null);
                        router.push("/dashboard");
                      }}
                      className="cursor-pointer rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/50"
                    >
                      <Home className="mr-2 h-4 w-4" />
                      <span className="text-sm">Dashboard Global</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/50">
                      <Plus className="mr-2 h-4 w-4" />
                      <span className="text-sm">Criar Nova Organização</span>
                    </DropdownMenuItem>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notificações */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:bg-primary/10"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="mt-1 w-80 rounded-xl border shadow-lg"
            >
              <DropdownMenuLabel className="px-4 py-3 text-sm font-semibold">
                Notificações
                <Badge variant="secondary" className="ml-2 rounded-full px-2">
                  3
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                <DropdownMenuItem className="cursor-pointer flex-col items-start gap-1.5 rounded-lg p-4 transition-colors hover:bg-accent/50">
                  <div className="flex w-full items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-100 p-1.5 dark:bg-blue-900/30">
                        <Ticket className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          Nova reserva confirmada
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Há 5 minutos
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="mt-1 text-xs text-muted-foreground">
                    João reservou 2 ingressos para Tech Conference
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer flex-col items-start gap-1.5 rounded-lg p-4 transition-colors hover:bg-accent/50">
                  <div className="flex w-full items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-green-100 p-1.5 dark:bg-green-900/30">
                        <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          Pagamento recebido
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Há 1 hora
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="mt-1 text-xs text-muted-foreground">
                    R$ 200,00 recebido via PIX
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer flex-col items-start gap-1.5 rounded-lg p-4 transition-colors hover:bg-accent/50">
                  <div className="flex w-full items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-purple-100 p-1.5 dark:bg-purple-900/30">
                        <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          Check-in realizado
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Há 3 horas
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="mt-1 text-xs text-muted-foreground">
                    Maria fez check-in no evento Startup Summit
                  </span>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <DropdownMenuItem
                  onClick={() =>
                    router.push(
                      `/org/${currentOrganization?.slug}/notifications` as any,
                    )
                  }
                  className="cursor-pointer rounded-lg px-3 py-2.5 text-center text-sm font-medium transition-colors hover:bg-accent/50"
                >
                  Ver todas as notificações
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Menu do Usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="group flex items-center gap-2 rounded-full px-2 hover:bg-primary/5"
              >
                <Avatar className="h-8 w-8 ring-2 ring-primary/10 transition-all group-hover:ring-primary/30">
                  <AvatarImage
                    src={session?.user.image ?? ""}
                    alt={session?.user.name}
                  />
                  <AvatarFallback className="bg-linear-to-br from-primary to-primary/70">
                    {session?.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {session?.user.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {currentOrganization?.name || "Dashboard Global"}
                  </span>
                </div>
                <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground transition-transform group-hover:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="mt-1 w-56 rounded-xl border shadow-lg"
            >
              <div className="px-4 py-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">
                    {session?.user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {session?.user.email}
                  </p>
                  {session?.user.emailVerified && (
                    <Badge
                      variant="outline"
                      className="mt-2 w-fit rounded-full px-2 py-0.5 text-[10px]"
                    >
                      <div className="flex items-center gap-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Email Verificado
                      </div>
                    </Badge>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <DropdownMenuItem
                  onClick={() => router.push("/profile" as any)}
                  className="cursor-pointer rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/50"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span className="text-sm">Meu Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/settings" as any)}
                  className="cursor-pointer rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/50"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span className="text-sm">Configurações</span>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <DropdownMenuItem
                  onClick={signOut}
                  className="cursor-pointer rounded-lg bg-destructive/10 px-3 py-2.5 text-destructive transition-colors hover:bg-destructive/20"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="text-sm font-medium">Sair</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Seletor da Organização mobile */}
      <div className="lg:hidden border-t bg-linear-to-r from-background/50 to-background/30">
        <div className="container px-4 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between rounded-lg border px-3 py-2 hover:bg-accent/50"
              >
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-primary/10 p-1">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="truncate text-sm font-medium">
                    {currentOrganization?.name || "Selecionar Organização"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[calc(100vw-2rem)] rounded-xl border shadow-lg">
              <div className="max-h-64 overflow-y-auto p-1">
                {myMemberships?.map((member) => (
                  <DropdownMenuItem
                    key={member?.organization?.id}
                    onClick={() =>
                      handleOrganizationChange(member?.organization?.id ?? null)
                    }
                    className="cursor-pointer rounded-lg px-3 py-3 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg",
                          currentOrganization?.id === member?.organization?.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary",
                        )}
                      >
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {member?.organization?.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {member?.role} •{" "}
                          {member?.is_owner ? "Proprietário" : "Membro"}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <DropdownMenuItem
                  onClick={() => {
                    handleOrganizationChange(null);
                    router.push("/dashboard");
                  }}
                  className="cursor-pointer rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/50"
                >
                  <Home className="mr-2 h-4 w-4" />
                  <span className="text-sm">Dashboard Global</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
