"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/providers/auth-provider";

export default function DashboardPage() {
  const { signOut } = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted/30 p-4">
      <h1 className="text-4xl font-bold">Bem-vindo ao Dashboard</h1>
      <Button onClick={() => signOut()}>Sair</Button>
    </div>
  );
}
