"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="h-4 w-4" />
              Plataforma de Eventos Inteligente
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Crie e Gerencie Eventos{" "}
              <span className="text-primary">Sem Complicação</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              Do cadastro ao check-in, automatize todo o processo dos seus
              eventos. Capacidade, ingressos, fila de espera e relatórios em uma
              só plataforma.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="gap-2 cursor-pointer">
                <Calendar className="h-5 w-5" />
                Criar Evento Gratuito
              </Button>
              <Button size="lg" variant="outline" className="cursor-pointer">
                Agendar Demonstração
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">
                  Disponibilidade
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">+10k</div>
                <div className="text-sm text-muted-foreground">
                  Eventos Criados
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Suporte</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <Card className="border-2 shadow-2xl">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-sm font-medium">
                      Dashboard - Evento Ativo
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-lg mb-2">
                        Tech Conference 2024
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>15 Nov, 9:00 AM</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>85/100 participantes</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Early Bird</span>
                        <span className="font-medium">ESGOTADO</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ delay: 0.5 }}
                          className="h-full bg-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Ingresso Normal</span>
                        <span className="font-medium">15 disponíveis</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "70%" }}
                          transition={{ delay: 0.7 }}
                          className="h-full bg-purple-500"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Check-ins
                          </div>
                          <div className="text-2xl font-bold">42</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Arrecadado
                          </div>
                          <div className="text-2xl font-bold">R$ 8,450</div>
                        </div>
                        <Button size="sm">Ver Detalhes</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg"
            >
              <div className="text-sm font-medium">15 reservas hoje</div>
            </motion.div>

            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute -bottom-4 -left-4 bg-purple-500 text-white px-3 py-2 rounded-lg shadow-lg"
            >
              <div className="text-sm font-medium">5 na fila de espera</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
