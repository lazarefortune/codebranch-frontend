"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loader } from "@/shared/ui/loader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Attendre que le chargement soit terminé avant de vérifier l'authentification
    if (!isLoading && !isAuthenticated) {
      router.push("/connexion");
    }
  }, [isAuthenticated, isLoading, router]);

  // Afficher un loader pendant le chargement
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // Si pas authentifié, afficher un loader pendant la redirection
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
