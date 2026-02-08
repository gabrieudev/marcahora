"use client";

import { useSession } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function PrivateRoutes({ children }: { children: React.ReactNode }) {
  const { session, isSessionLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isSessionLoading && !session) {
      router.push("/");
    }
  }, [isSessionLoading, session, router]);

  if (isSessionLoading) return null;
  if (!session) return null;

  return <>{children}</>;
}
