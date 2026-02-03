"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { resetPassword } from "../services/auth.api";
import type { ResetPasswordRequest } from "@/contracts/auth.contract";

/**
 * Hook pour la réinitialisation du mot de passe
 */
export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
    onSuccess: () => {
      // Rediriger vers la page de connexion après réinitialisation réussie
      router.push("/connexion");
    },
    onError: (error) => {
      console.error("Erreur lors de la réinitialisation:", error);
    },
  });
}
