"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CTASection() {
  const router = useRouter();

  return (
    <section id="cta" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-linear-to-r from-primary to-purple-600 rounded-2xl p-8 text-center text-white"
        >
          <div className="max-w-2xl mx-auto">
            <Users className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Comece hoje mesmo</h3>
            <p className="mb-6 opacity-90">
              Crie sua conta gratuitamente e descubra como o MarcaHora pode
              simplificar a gestão dos seus eventos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/auth/signup")}
                className="cursor-pointer"
                size="lg"
                variant="secondary"
              >
                Criar Conta Gratuita
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
