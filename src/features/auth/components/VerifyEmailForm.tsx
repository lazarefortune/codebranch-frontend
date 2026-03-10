"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ErrorMessage } from "@/shared/ui/error-message";
import { useVerifyEmail } from "../hooks/useVerifyEmail";
import { useResendVerificationCode } from "../hooks/useResendVerificationCode";
import { verifyEmailSchema, type VerifyEmailFormData } from "../schemas/auth.schema";
import { ApiClientError } from "@/shared/api/client";
import { GitBranch } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
    hidden: {opacity: 0, y: 20},
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            delay: i * 0.08,
            ease: "easeOut" as const,
        },
    })
}

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email,
    },
  });

  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendVerificationCode();

  const onSubmit = async (data: VerifyEmailFormData) => {
    verifyMutation.mutate(data);
  };

  const handleResend = () => {
    if (email) {
      resendMutation.mutate({ email });
    }
  };

  const getErrorMessage = (error: unknown): string | undefined => {
    if (error instanceof ApiClientError) {
      if (error.code === "INVALID_CODE") {
        return "Code invalide";
      }
      if (error.code === "CODE_EXPIRED") {
        return "Le code a expiré. Veuillez en demander un nouveau.";
      }
      return error.message;
    }
    return "Une erreur est survenue";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto w-full p-6">
      <motion.div
          className="mb-6 flex items-center gap-2 justify-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
      >
        <Link href="/" className="flex items-center gap-2">
          <GitBranch className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">
            Code<span className="text-primary">Branch</span>
          </span>
        </Link>
      </motion.div>

      <motion.div className="mb-10" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
        <h1 className="text-center text-5xl font-bold">Vérification</h1>
        <p className="text-center text-slate-500">Entrez le code de vérification reçu par email</p>
      </motion.div>

      <motion.div className="space-y-6" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...registerField("email")}
            disabled={verifyMutation.isPending || !!email}
          />
          {errors.email && <ErrorMessage message={errors.email.message} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Code de vérification</Label>
          <Input
            id="code"
            type="text"
            placeholder="123456"
            maxLength={6}
            {...registerField("code")}
            disabled={verifyMutation.isPending}
          />
          {errors.code && <ErrorMessage message={errors.code.message} />}
        </div>

        {verifyMutation.error && (
          <ErrorMessage message={getErrorMessage(verifyMutation.error)} />
        )}

        {resendMutation.isSuccess && (
          <div className="text-sm text-green-600 dark:text-green-400">
            Code renvoyé avec succès
          </div>
        )}

        <Button type="submit" className="w-full" loading={verifyMutation.isPending}>
          Vérifier
        </Button>

        <div className="text-center">
          <Button
            type="button"
            variant="ghost"
            onClick={handleResend}
            disabled={resendMutation.isPending || !email}
            loading={resendMutation.isPending}
          >
            Renvoyer le code
          </Button>
        </div>

        <p className="text-center text-base text-muted-foreground">
          <Link href="/connexion" className="text-primary hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </motion.div>
    </form>
  );
}
