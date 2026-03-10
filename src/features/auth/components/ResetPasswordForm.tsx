"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { PasswordInput } from "@/shared/ui/password-input";
import { Label } from "@/shared/ui/label";
import { ErrorMessage } from "@/shared/ui/error-message";
import { useResetPassword } from "../hooks/useResetPassword";
import { resetPasswordSchema, type ResetPasswordFormData } from "../schemas/auth.schema";
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

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
    },
  });

  const mutation = useResetPassword();

  const onSubmit = async (data: ResetPasswordFormData) => {
    mutation.mutate({
      token: data.token,
      newPassword: data.newPassword,
    });
  };

  const getErrorMessage = (error: unknown): string | undefined => {
    if (error instanceof ApiClientError) {
      if (error.code === "TOKEN_INVALID") {
        return "Le lien de réinitialisation est invalide";
      }
      if (error.code === "TOKEN_EXPIRED") {
        return "Le lien de réinitialisation a expiré. Veuillez en demander un nouveau.";
      }
      return error.message;
    }
    return "Une erreur est survenue";
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto w-full p-6">
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
        <motion.div className="space-y-4" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <ErrorMessage message="Token de réinitialisation manquant. Veuillez utiliser le lien reçu par email." />
          <p className="text-center text-base text-muted-foreground">
            <Link href="/mot-de-passe-oublie" className="text-primary hover:underline">
              Demander un nouveau lien
            </Link>
          </p>
        </motion.div>
      </div>
    );
  }

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
        <h1 className="text-center text-5xl font-bold">Nouveau mot de passe</h1>
        <p className="text-center text-slate-500">Entrez votre nouveau mot de passe</p>
      </motion.div>

      <motion.div className="space-y-6" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
        <div className="space-y-2">
          <Label htmlFor="newPassword">Nouveau mot de passe</Label>
          <PasswordInput
            id="newPassword"
            {...registerField("newPassword")}
            disabled={mutation.isPending}
          />
          {errors.newPassword && <ErrorMessage message={errors.newPassword.message} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <PasswordInput
            id="confirmPassword"
            {...registerField("confirmPassword")}
            disabled={mutation.isPending}
          />
          {errors.confirmPassword && <ErrorMessage message={errors.confirmPassword.message} />}
        </div>

        {mutation.error && (
          <ErrorMessage message={getErrorMessage(mutation.error)} />
        )}

        <Button type="submit" className="w-full" loading={mutation.isPending}>
          Réinitialiser le mot de passe
        </Button>

        <p className="text-center text-base text-muted-foreground">
          <Link href="/connexion" className="text-primary hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </motion.div>
    </form>
  );
}
