"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { verifyEmail } from "../services/auth.api";
import type { VerifyEmailRequest } from "@/contracts/auth.contract";

/**
 * Hook pour la vérification de l'email
 */
export function useVerifyEmail() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: VerifyEmailRequest) => verifyEmail(data),
    onSuccess: () => {
      // Rediriger vers la page de connexion après vérification réussie
      router.push("/connexion");
    },
    onError: (error) => {
      console.error("Erreur lors de la vérification:", error);
    },
  });
}
