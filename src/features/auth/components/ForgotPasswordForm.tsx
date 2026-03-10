"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ErrorMessage } from "@/shared/ui/error-message";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "../schemas/auth.schema";
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

export function ForgotPasswordForm() {
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const mutation = useForgotPassword();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    mutation.mutate(data);
  };

  if (mutation.isSuccess) {
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
          <div className="text-center space-y-2">
            <p className="text-base">
              Un email de réinitialisation a été envoyé à l&apos;adresse fournie.
            </p>
            <p className="text-sm text-muted-foreground">
              Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
            </p>
          </div>
          <p className="text-center text-base text-muted-foreground">
            <Link href="/connexion" className="text-primary hover:underline">
              Retour à la connexion
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
        <h1 className="text-center text-5xl font-bold">Mot de passe oublié</h1>
        <p className="text-center text-slate-500">Entrez votre email pour recevoir un lien de réinitialisation</p>
      </motion.div>

      <motion.div className="space-y-6" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...registerField("email")}
            disabled={mutation.isPending}
          />
          {errors.email && <ErrorMessage message={errors.email.message} />}
        </div>

        {mutation.error && (
          <ErrorMessage message="Une erreur est survenue. Veuillez réessayer." />
        )}

        <Button type="submit" className="w-full" loading={mutation.isPending}>
          Envoyer le lien de réinitialisation
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
