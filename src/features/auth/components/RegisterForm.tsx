"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { PasswordInput } from "@/shared/ui/password-input";
import { Label } from "@/shared/ui/label";
import { ErrorMessage } from "@/shared/ui/error-message";
import { useRegister } from "../hooks/useRegister";
import { registerSchema, type RegisterFormData } from "../schemas/auth.schema";
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

export function RegisterForm() {
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useRegister();

  const onSubmit = async (data: RegisterFormData) => {
    mutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  const getErrorMessage = (error: unknown): string | undefined => {
    if (error instanceof ApiClientError) {
      if (error.code === "EMAIL_ALREADY_EXISTS") {
        return "Cet email est déjà utilisé";
      }
      if (error.code === "VALIDATION_ERROR" && error.details) {
        return error.details[0]?.message;
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
        <h1 className="text-center text-5xl font-bold">Créer un compte</h1>
        <p className="text-center text-slate-500">Rejoignez CodeBranch dès maintenant</p>
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

        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <PasswordInput
            id="password"
            {...registerField("password")}
            disabled={mutation.isPending}
          />
          {errors.password && <ErrorMessage message={errors.password.message} />}
        </div>

        {mutation.error && (
          <ErrorMessage message={getErrorMessage(mutation.error)} />
        )}

        <Button type="submit" className="w-full" loading={mutation.isPending}>
          S&apos;inscrire
        </Button>

        <p className="text-center text-base text-muted-foreground">
          Déjà un compte ?{" "}
          <Link href="/connexion" className="text-primary hover:underline">
            Se connecter
          </Link>
        </p>
      </motion.div>
    </form>
  );
}
