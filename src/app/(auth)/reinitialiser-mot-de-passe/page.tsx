"use client";

import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { Loader } from "@/shared/ui/loader";
import Image from "next/image";

function ResetPasswordContent() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center">
        <ResetPasswordForm/>
      </div>
      <div className="bg-red-500/10 hidden md:block relative h-screen">
        <Image src="/auth-illustration.jpg" alt="Illustration de réinitialisation" fill className="object-cover" />
        <div className="absolute z-10 inset-0 bg-gradient-to-t from-green-500/30 to-transparent"/>
        <div className="absolute z-10 bottom-8 left-8 text-sm text-muted-foreground">
          <p className="text-white text-lg font-semibold">
            CodeBranch
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="lg" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
