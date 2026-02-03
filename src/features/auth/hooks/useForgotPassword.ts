"use client";

import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../services/auth.api";
import type { ForgotPasswordRequest } from "@/contracts/auth.contract";

/**
 * Hook pour la demande de réinitialisation de mot de passe
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => forgotPassword(data),
    onError: (error) => {
      console.error("Erreur lors de la demande de réinitialisation:", error);
    },
  });
}
