"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ErrorMessage } from "@/shared/ui/error-message";
import { useVerifyEmail } from "../hooks/useVerifyEmail";
import { useResendVerificationCode } from "../hooks/useResendVerificationCode";
import { verifyEmailSchema, type VerifyEmailFormData } from "../schemas/auth.schema";
import { ApiClientError } from "@/shared/api/client";

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
    </form>
  );
}
