"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Ticket,
  Shield,
  BarChart3,
  Bell,
  Users,
  QrCode,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Gestão de Eventos",
    description:
      "Crie, edite e publique eventos com controle total sobre datas, locais e capacidade.",
    badge: "CRUD Completo",
    color: "bg-blue-500",
  },
  {
    icon: Ticket,
    title: "Lotes de Ingressos",
    description:
      "Configure diferentes lotes (early bird, normal) com preços, prazos e limites específicos.",
    badge: "Flexível",
    color: "bg-purple-500",
  },
  {
    icon: Shield,
    title: "Controle de Concorrência",
    description:
      "Sistema anti-overbooking com reservas atômicas que garantem integridade nas transações.",
    badge: "Seguro",
    color: "bg-green-500",
  },
  {
    icon: BarChart3,
    title: "Relatórios Avançados",
    description:
      "Taxa de ocupação, receita por evento, conversão por canal em tempo real.",
    badge: "Insights",
    color: "bg-orange-500",
  },
  {
    icon: Bell,
    title: "Sistema de Notificações",
    description:
      "Email e push automáticos para lembretes, confirmações e alertas da fila de espera.",
    badge: "Automático",
    color: "bg-pink-500",
  },
  {
    icon: QrCode,
    title: "Check-in Inteligente",
    description:
      "Validação rápida via QR Code ou lista, com registro em tempo real no dashboard.",
    badge: "Ágil",
    color: "bg-cyan-500",
  },
  {
    icon: Users,
    title: "Gestão de Equipe",
    description:
      "Roles e permissions para organizadores e membros da equipe com acessos específicos.",
    badge: "Colaborativo",
    color: "bg-indigo-500",
  },
  {
    icon: Lock,
    title: "Banco de Dados Seguro",
    description:
      "PostgreSQL com schema otimizado, constraints e transactions para máxima confiabilidade.",
    badge: "Robusto",
    color: "bg-red-500",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            Funcionalidades
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Tudo que você precisa para eventos de sucesso
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Da criação ao check-in, automatize cada etapa com nossa plataforma
            completa
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="h-full border hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div
                      className={`p-3 rounded-lg ${feature.color} text-white`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
