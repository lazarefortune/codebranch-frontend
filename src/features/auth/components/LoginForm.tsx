"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { PasswordInput } from "@/shared/ui/password-input";
import { Label } from "@/shared/ui/label";
import { ErrorMessage } from "@/shared/ui/error-message";
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";
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

export function LoginForm() {
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useLogin();

  const onSubmit = async (data: LoginFormData) => {
    mutation.mutate(data);
  };

  const getErrorMessage = (error: unknown): string | undefined => {
    if (error instanceof ApiClientError) {
      if (error.code === "INVALID_CREDENTIALS") {
        return "Email ou mot de passe incorrect";
      }
      if (error.code === "EMAIL_NOT_VERIFIED") {
        return "Veuillez vérifier votre email avant de vous connecter";
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
        <h1 className="text-center text-5xl font-bold">Bon retour</h1>
        <p className="text-center text-slate-500">Connectez vous à votre codebranch</p>
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
          Se connecter
        </Button>

        <div className="text-center">
          <Link
            href="/mot-de-passe-oublie"
            className="text-sm text-primary hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <p className="text-center text-base text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="text-primary hover:underline">
            Inscrivez-vous
          </Link>
        </p>
      </motion.div>
    </form>
  );
}
