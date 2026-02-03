"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "../services/auth.api";
import { setAccessToken } from "@/shared/hooks/useAuthState";
import { useAuth } from "./useAuth";
import type { LoginRequest } from "@/contracts/auth.contract";

/**
 * Hook pour la connexion d'un utilisateur
 */
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { refreshAuth } = useAuth();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (response) => {
      // Stocker le token dans localStorage
      setAccessToken(response.accessToken);

      // Mettre à jour l'état auth du provider (hasToken) pour éviter la redirection vers /connexion
      refreshAuth();

      // Invalider et refetch la query "me" pour charger l'utilisateur
      queryClient.invalidateQueries({ queryKey: ["me"] });

      // Rediriger vers le dashboard
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Erreur lors de la connexion:", error);
    },
  });
}
