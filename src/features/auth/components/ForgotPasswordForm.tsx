"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ErrorMessage } from "@/shared/ui/error-message";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "../schemas/auth.schema";

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
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <p className="text-base">
            Un email de réinitialisation a été envoyé à l'adresse fournie.
          </p>
          <p className="text-sm text-muted-foreground">
            Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
          </p>
        </div>
      </div>
    );
  }

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

      {mutation.error && (
        <ErrorMessage message="Une erreur est survenue. Veuillez réessayer." />
      )}

      <Button type="submit" className="w-full" loading={mutation.isPending}>
        Envoyer le lien de réinitialisation
      </Button>
    </form>
  );
}
