"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

interface SocialLoginProps {
  isLoading?: boolean;
}

export default function SocialLogin({ isLoading }: SocialLoginProps) {
  const router = useRouter();
  const { theme } = useTheme();

  const socialProviders = [
    {
      name: "Google",
      icon: FaGoogle,
      provider: "google",
      color: "hover:bg-red-50 border-red-200 text-red-600 hover:text-red-700",
      signOn: async () => {
        const { error } = await authClient.signIn.social({
          provider: "google",
        });

        if (error) {
          toast.error("Erro ao iniciar login com Google");
          return;
        }

        router.push("/dashboard");
      },
    },
    {
      name: "GitHub",
      icon: FaGithub,
      provider: "github",
      color: `${theme === "dark" ? "hover:bg-white border-white text-white" : "hover:bg-black border-black text-black"}`,
      signOn: async () => {
        const { error } = await authClient.signIn.social({
          provider: "github",
        });

        if (error) {
          toast.error("Erro ao iniciar login com GitHub");
          return;
        }

        router.push("/dashboard");
      },
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      {socialProviders.map((provider, index) => (
        <motion.div
          key={provider.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            type="button"
            variant="outline"
            className={`w-full cursor-pointer ${provider.color}`}
            onClick={provider.signOn}
            disabled={isLoading}
          >
            <provider.icon className="h-4 w-4" />
            <span className="ml-2 text-sm">{provider.name}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
