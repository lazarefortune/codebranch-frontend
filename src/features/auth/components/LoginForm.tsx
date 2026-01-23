"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ErrorMessage } from "@/shared/ui/error-message";
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";
import { ApiClientError } from "@/shared/api/client";

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
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

      <p className="text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="text-primary hover:underline">
          S&apos;inscrire
        </Link>
      </p>
    </form>
  );
}
