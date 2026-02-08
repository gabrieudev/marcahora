"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Menu, Users, X } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type MenuItem = {
  label: string;
  href: Route;
};

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { label: "Recursos", href: "#features" },
    { label: "Como Funciona", href: "#how-it-works" },
    { label: "Começar", href: "#cta" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <div className="rounded-lg p-2">
              <Image
                src="/logo.png"
                alt="MarcaHora Logo"
                width={24}
                height={24}
              />
            </div>
            <span className="text-xl font-bold tracking-tight">MarcaHora</span>
          </motion.div>
          <Badge variant="outline" className="ml-2 hidden sm:flex">
            Beta
          </Badge>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button
            onClick={() => router.push("/auth/signin")}
            className="cursor-pointer"
            variant="outline"
            size="sm"
          >
            Entrar
          </Button>
          <Button
            onClick={() => router.push("/auth/signup")}
            className="cursor-pointer"
            size="sm"
          >
            <Users className="h-4 w-4 mr-2" />
            Começar Gratuitamente
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t"
        >
          <div className="container mx-auto px-4 py-4 space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block py-2 text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <Button
                onClick={() => router.push("/auth/signin")}
                variant="outline"
                className="w-full"
              >
                Entrar
              </Button>
              <Button
                onClick={() => router.push("/auth/signup")}
                className="w-full"
              >
                Começar Gratuitamente
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
