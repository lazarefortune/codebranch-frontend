"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ErrorMessage } from "@/shared/ui/error-message";
import { useResetPassword } from "../hooks/useResetPassword";
import { resetPasswordSchema, type ResetPasswordFormData } from "../schemas/auth.schema";
import { ApiClientError } from "@/shared/api/client";

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
      <div className="space-y-4">
        <ErrorMessage message="Token de réinitialisation manquant. Veuillez utiliser le lien reçu par email." />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
        <Input
          id="newPassword"
          type="password"
          {...registerField("newPassword")}
          disabled={mutation.isPending}
        />
        {errors.newPassword && <ErrorMessage message={errors.newPassword.message} />}
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
        Réinitialiser le mot de passe
      </Button>
    </form>
  );
}
