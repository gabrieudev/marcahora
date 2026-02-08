"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  CalendarPlus,
  Ticket,
  BellRing,
  CheckCircle,
  BarChart,
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Cadastro",
    description: "Crie sua conta ou faça login como organizador",
    color: "bg-blue-500",
  },
  {
    icon: CalendarPlus,
    title: "Crie seu Evento",
    description: "Defina título, descrição, data, local e capacidade",
    color: "bg-purple-500",
  },
  {
    icon: Ticket,
    title: "Configure Ingressos",
    description: "Adicione lotes com preços, prazos e limites",
    color: "bg-green-500",
  },
  {
    icon: BellRing,
    title: "Divulgue e Reserve",
    description: "Compartilhe e aceite reservas com controle anti-overbooking",
    color: "bg-orange-500",
  },
  {
    icon: CheckCircle,
    title: "Check-in no Evento",
    description: "Valide participantes via QR Code ou lista",
    color: "bg-pink-500",
  },
  {
    icon: BarChart,
    title: "Analise Resultados",
    description: "Acesse relatórios de ocupação e receita",
    color: "bg-cyan-500",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            Fluxo Simples
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Como funciona em 6 passos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Do cadastro ao relatório final, tudo em uma plataforma intuitiva
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-blue-500 via-purple-500 to-cyan-500 hidden lg:block" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${index % 2 === 0 ? "lg:text-right lg:pr-12" : "lg:pl-12 lg:mt-20"}`}
              >
                <div className="absolute hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-background border-2 border-primary left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="text-sm font-bold">{index + 1}</span>
                </div>

                <Card className="border hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div
                      className={`inline-flex p-3 rounded-lg ${step.color} text-white mb-4`}
                    >
                      <step.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
