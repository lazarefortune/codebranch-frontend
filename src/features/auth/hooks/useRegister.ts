"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { register } from "../services/auth.api";
import type { RegisterRequest } from "@/contracts/auth.contract";

/**
 * Hook pour l'inscription d'un nouvel utilisateur
 */
export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: (response) => {
      // Rediriger vers la page de vérification email avec l'email en paramètre
      router.push(`/verification-email?email=${encodeURIComponent(response.user.email)}`);
    },
    onError: (error) => {
      // Les erreurs sont gérées par le composant via mutation.error
      console.error("Erreur lors de l'inscription:", error);
    },
  });
}
