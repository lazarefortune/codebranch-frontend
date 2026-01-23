import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
          <CardDescription>
            Remplissez le formulaire ci-dessous pour créer votre compte CodeBranch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
