"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { Route } from "next";

type FooterLink = {
  label: string;
  href: Route;
};

const footerLinks: Record<string, FooterLink[]> = {
  Empresa: [
    { label: "Sobre Nós", href: "#" },
    { label: "Carreiras", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Imprensa", href: "#" },
    { label: "Parceiros", href: "#" },
    { label: "Contato", href: "#" },
  ],
  Recursos: [
    { label: "Documentação", href: "#" },
    { label: "Guia de Início", href: "#" },
    { label: "Centro de Ajuda", href: "#" },
    { label: "Tutoriais", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "Comunidade", href: "#" },
  ],
  Legal: [
    { label: "Termos de Serviço", href: "#" },
    { label: "Política de Privacidade", href: "#" },
    { label: "Cookies", href: "#" },
    { label: "LGPD", href: "#" },
    { label: "Acessibilidade", href: "#" },
    { label: "Segurança", href: "#" },
  ],
};

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Seção de Newsletter */}
        <div className="py-12 border-b border-slate-700">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="rounded-lg bg-primary p-2">
                  <Calendar className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">MarcaHora</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Não perca as novidades sobre eventos
              </h3>
              <p className="text-slate-300 mb-6">
                Inscreva-se para receber dicas, novidades da plataforma e
                ofertas especiais.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
                <Button className="whitespace-nowrap">
                  <Mail className="h-4 w-4 mr-2" />
                  Inscrever
                </Button>
              </div>
              <p className="text-sm text-slate-400 mt-4">
                Prometemos não enviar spam. Você pode cancelar a qualquer
                momento.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="inline-flex p-3 rounded-lg bg-primary/20 text-primary mb-3">
                    <Phone className="h-6 w-6 text-blue-500" />
                  </div>
                  <h4 className="font-semibold mb-1">Suporte</h4>
                  <p className="text-sm text-slate-300">(11) 99999-9999</p>
                  <p className="text-xs text-slate-400">Seg-Sex, 9h-18h</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex p-3 rounded-lg bg-primary/20 text-primary mb-3">
                    <Mail className="h-6 w-6 text-blue-500" />
                  </div>
                  <h4 className="font-semibold mb-1">E-mail</h4>
                  <p className="text-sm text-slate-300">
                    suporte@marcahora.com
                  </p>
                  <p className="text-xs text-slate-400">Resposta em até 24h</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex p-3 rounded-lg bg-primary/20 text-primary mb-3">
                    <MapPin className="h-6 w-6 text-blue-500" />
                  </div>
                  <h4 className="font-semibold mb-1">Localização</h4>
                  <p className="text-sm text-slate-300">São Paulo, SP</p>
                  <p className="text-xs text-slate-400">Brasil</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Links do Rodapé */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-30">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="rounded-lg bg-primary p-2">
                  <Calendar className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">MarcaHora</span>
              </div>
              <p className="text-slate-300 mb-6">
                A plataforma completa para criar, gerenciar e promover eventos
                de sucesso.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="font-semibold text-lg mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-300 hover:text-white transition-colors hover:underline inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <Separator className="bg-slate-700" />

        {/* Rodapé Inferior */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-slate-300">
                © {currentYear} MarcaHora. Todos os direitos reservados.
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Feito com <Heart className="inline h-3 w-3 text-red-500" /> para
                organizadores de eventos.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className="border-slate-700 text-slate-300"
              >
                v1.0.0
              </Badge>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Em produção
              </Badge>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-slate-300">Sistema online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
