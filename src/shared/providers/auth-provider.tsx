"use client";

import { createContext, useContext, ReactNode, useState, useEffect, startTransition, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/features/auth/services/auth.api";
import { isAuthenticated } from "@/shared/hooks/useAuthState";
import type { User } from "@/contracts/auth.contract";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** À appeler après avoir stocké un nouveau token (ex. après login) pour mettre à jour l'état auth */
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  refreshAuth: () => {},
});

/**
 * Provider d'authentification
 * Gère l'état de l'utilisateur connecté via React Query
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // Utiliser useState pour éviter les problèmes d'hydratation
  // isAuthenticated() utilise localStorage qui n'est pas disponible côté serveur
  const [hasToken, setHasToken] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Vérifier le token uniquement côté client après le montage
  useEffect(() => {
    startTransition(() => {
      setHasToken(isAuthenticated());
      setIsInitialized(true);
    });
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getCurrentUser,
    enabled: hasToken && isInitialized,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const refreshAuth = useCallback(() => {
    setHasToken(isAuthenticated());
  }, []);

  const value: AuthContextValue = {
    user: data?.user || null,
    isAuthenticated: hasToken && !!data?.user,
    isLoading: !isInitialized || (hasToken ? isLoading : false),
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook pour accéder au contexte d'authentification
 */
export function useAuth() {
  return useContext(AuthContext);
}
