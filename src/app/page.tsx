import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className="mx-auto max-w-2xl space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">CodeBranch</h1>
          <p className="text-lg text-muted-foreground">
            Système de design et composants UI
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bienvenue</CardTitle>
            <CardDescription>
              Le système de design est prêt à être utilisé
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Consultez la page du système de design pour voir tous les
              composants disponibles et leurs variantes.
            </p>
            <Link href="/systeme-design">
              <Button variant="primary" size="lg">
                Voir le système de design
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
