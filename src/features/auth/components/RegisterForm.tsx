"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ErrorMessage } from "@/shared/ui/error-message";
import { useRegister } from "../hooks/useRegister";
import { registerSchema, type RegisterFormData } from "../schemas/auth.schema";
import { ApiClientError } from "@/shared/api/client";

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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...registerField("confirmPassword")}
          disabled={mutation.isPending}
        />
        {errors.confirmPassword && <ErrorMessage message={errors.confirmPassword.message} />}
      </div>

      {mutation.error && (
        <ErrorMessage message={getErrorMessage(mutation.error)} />
      )}

      <Button type="submit" className="w-full" loading={mutation.isPending}>
        S&apos;inscrire
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="text-primary hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
