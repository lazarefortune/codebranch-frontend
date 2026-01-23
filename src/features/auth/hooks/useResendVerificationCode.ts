"use client";

import { useMutation } from "@tanstack/react-query";
import { resendVerificationCode } from "../services/auth.api";
import type { ResendVerificationCodeRequest } from "@/contracts/auth.contract";

/**
 * Hook pour renvoyer le code de vérification
 */
export function useResendVerificationCode() {
  return useMutation({
    mutationFn: (data: ResendVerificationCodeRequest) => resendVerificationCode(data),
    onError: (error) => {
      console.error("Erreur lors de l'envoi du code:", error);
    },
  });
}
