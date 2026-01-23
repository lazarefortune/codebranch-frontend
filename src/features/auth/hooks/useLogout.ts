"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logout } from "../services/auth.api";
import { clearAuth } from "@/shared/hooks/useAuthState";

/**
 * Hook pour la déconnexion
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Nettoyer l'état d'authentification
      clearAuth();

      // Invalider toutes les queries
      queryClient.clear();

      // Rediriger vers la page de connexion
      router.push("/connexion");
    },
    onError: (error) => {
      // Même en cas d'erreur, on nettoie l'état local
      clearAuth();
      queryClient.clear();
      router.push("/connexion");
      console.error("Erreur lors de la déconnexion:", error);
    },
  });
}
