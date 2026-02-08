"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FaLinkedin, FaGoogle } from "react-icons/fa";

interface SocialLoginProps {
  isLoading?: boolean;
}

export default function SocialLogin({ isLoading }: SocialLoginProps) {
  const socialProviders = [
    {
      name: "Google",
      icon: FaGoogle,
      provider: "google",
      color: "hover:bg-red-50 border-red-200 text-red-600 hover:text-red-700",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      provider: "linkedin",
      color:
        "hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700",
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
