"use client";

import { useSession } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function PublicRoutes({ children }: { children: React.ReactNode }) {
  const { session, isSessionLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isSessionLoading && session) {
      router.replace("/dashboard");
    }
  }, [isSessionLoading, session, router]);

  if (isSessionLoading) return null;
  if (session) return null;

  return <>{children}</>;
}
