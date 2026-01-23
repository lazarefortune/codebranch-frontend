"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loader } from "@/shared/ui/loader";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Éviter les problèmes d'hydratation en s'assurant que le composant est monté côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router, isMounted]);

  // Pendant le chargement initial ou si pas encore monté, afficher le loader
  // Cela garantit que le rendu initial est le même côté serveur et client
  if (!isMounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className="mx-auto max-w-2xl space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">CodeBranch</h1>
          <p className="text-lg text-muted-foreground">
            Plateforme de pages publiques professionnelles
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bienvenue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/inscription">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  S'inscrire
                </Button>
              </Link>
              <Link href="/connexion">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Se connecter
                </Button>
              </Link>
            </div>
            <div className="pt-4">
              <Link href="/systeme-design" className="text-sm text-muted-foreground hover:text-foreground">
                Voir le système de design
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
