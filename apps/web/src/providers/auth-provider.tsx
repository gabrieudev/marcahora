"use client";

import { authClient } from "@/lib/auth-client";
import type { Prettify } from "better-auth";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

type InferSession<T> = T extends () => Promise<infer R>
  ? R extends { data?: infer D }
    ? D
    : never
  : never;

type RawSession = InferSession<typeof authClient.getSession>;
type Session = NonNullable<RawSession>;

type SessionContextValue = {
  session: Session | null;
  isAuthLoading: boolean;
  isSessionLoading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (body: Prettify<Session["user"]>) => Promise<void>;
  signIn: (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | undefined>(
  undefined,
);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const loadSession = async () => {
    setIsSessionLoading(true);
    try {
      const { data } = await authClient.getSession();
      setSession(data ?? null);
    } finally {
      setIsSessionLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
    await loadSession();
  };

  const signUp = async (body: any) => {
    setIsAuthLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name: body.name,
        email: body.email,
        password: body.password,
      });

      if (error) {
        console.log("Erro ao fazer cadastro:", error);
        toast.error(`${error.message || "Tente novamente mais tarde"}`);
      }

      await loadSession();
      router.push("/email");
      sessionStorage.setItem("email", body.email);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signIn = async (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => {
    try {
      setIsAuthLoading(true);
      const { data } = await authClient.signIn.email(
        {
          email: email,
          password: password,
          rememberMe: rememberMe,
        },
        {
          onError: (ctx) => {
            if (ctx.error.status === 403) {
              sessionStorage.setItem("email", email);
              router.push("/email");
            } else {
              toast.error(
                "Email ou senha incorretos. Verifique suas credenciais e tente novamente.",
              );
            }
          },
        },
      );

      if (data?.user) {
        await loadSession();
        router.push("/dashboard");
      }
    } catch (error) {
      console.log("Erro inesperado:", error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      session,
      isAuthLoading,
      isSessionLoading,
      refresh: loadSession,
      signOut,
      signUp,
      signIn,
    }),
    [session, isAuthLoading, isSessionLoading],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx)
    throw new Error("useSession precisa ser usado dentro de SessionProvider");
  return ctx;
}
