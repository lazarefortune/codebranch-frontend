"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export default function DashboardPage() {
  const { user } = useAuth();
  const logoutMutation = useLogout();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>
            Bienvenue sur votre dashboard CodeBranch
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-base font-medium">{user?.email}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Statut</p>
            <p className="text-base font-medium">
              {user?.emailVerifiedAt ? "Email vérifié" : "Email non vérifié"}
            </p>
          </div>

          <Button
            variant="destructive"
            onClick={() => logoutMutation.mutate()}
            loading={logoutMutation.isPending}
          >
            Se déconnecter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
