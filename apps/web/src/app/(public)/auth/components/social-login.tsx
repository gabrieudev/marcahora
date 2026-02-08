"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Github, Chrome } from "lucide-react";
import { useTheme } from "next-themes";

interface SocialLoginProps {
  isLoading?: boolean;
}

export default function SocialLogin({ isLoading }: SocialLoginProps) {
  const { theme } = useTheme();

  const socialProviders = [
    {
      name: "Google",
      icon: Chrome,
      provider: "google",
      color: "hover:bg-red-50 border-red-200 text-red-600 hover:text-red-700",
    },
    {
      name: "GitHub",
      icon: Github,
      provider: "github",
      color: `${theme === "dark" ? "hover:bg-gray-700/50 border-gray-600 text-gray-300 hover:text-gray-100" : "hover:bg-white-100 border-white-300 text-white-800 hover:text-white-900"}`,
    },
  ];

  const handleSocialLogin = (provider: string) => {
    console.log(`Iniciando login com ${provider}`);
    // Implementação futura
  };

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
            onClick={() => handleSocialLogin(provider.provider)}
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
