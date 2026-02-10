"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";

export default function EmailPage() {
  const [resendCountdown, setResendCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const email = sessionStorage.getItem("email") || "";

  // Contagem para reenvio
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleResendEmail = async () => {
    if (resendCountdown > 0 || isResending) return;

    setIsResending(true);
    setResendMessage(null);

    try {
      await authClient.sendVerificationEmail({
        email: email,
        callbackURL: "/email",
      });

      setResendMessage({
        type: "success",
        text: "Email de verificação reenviado com sucesso!",
      });

      setResendCountdown(60);
    } catch {
      setResendMessage({
        type: "error",
        text: "Erro ao reenviar email. Tente novamente.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 to-orange-100 p-4 pb-30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex justify-center mb-4"
            >
              <div className="p-3 bg-amber-100 rounded-full">
                <Mail className="h-12 w-12 text-amber-600" />
              </div>
            </motion.div>

            <CardTitle className="text-2xl font-bold text-gray-800">
              Verifique seu email
            </CardTitle>

            <CardDescription className="text-gray-600 mt-2">
              Enviamos um link de verificação para o seu email.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Clique no link enviado para ativar sua conta.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-2">Não recebeu o email?</p>

                <Button
                  onClick={handleResendEmail}
                  disabled={resendCountdown > 0 || isResending}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Reenviar email
                      {resendCountdown > 0 && ` (${resendCountdown}s)`}
                    </>
                  )}
                </Button>

                {resendCountdown > 0 && !isResending && (
                  <p className="text-sm text-gray-500 mt-2">
                    Aguarde {resendCountdown}s para reenviar
                  </p>
                )}
              </div>

              {resendMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <Alert
                    className={
                      resendMessage.type === "success"
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }
                  >
                    {resendMessage.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription>{resendMessage.text}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Após confirmar o email, você poderá acessar normalmente.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
