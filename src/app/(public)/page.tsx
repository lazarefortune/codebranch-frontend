"use client";

import {useEffect, useState, startTransition} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/features/auth/hooks/useAuth";
import {Loader} from "@/shared/ui/loader";
import {Check, Loader2, Terminal, X, Zap} from "lucide-react";
import {AnimatePresence, motion} from "framer-motion";

const TAKEN_NAMES = ["demo", "admin", "codebranch"];

export default function Home() {
    const {isAuthenticated, isLoading} = useAuth();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [username, setUsername] = useState("");
    const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");

    const checkUsername = (value: string) => {
        const clean = value.toLowerCase().replace(/[^a-z0-9-_]/g, "");
        setUsername(clean);
        if (clean.length < 2) {
            setStatus("idle");
            return;
        }
        setStatus("checking");
        // Simulate availability check
        setTimeout(() => {
            setStatus(TAKEN_NAMES.includes(clean) ? "taken" : "available");
        }, 600);
    };

    const handleClaim = () => {
        if (status === "available") {
            // navigate("/demo");
        }
    };

    // Éviter les problèmes d'hydratation en s'assurant que le composant est monté côté client
    useEffect(() => {
        startTransition(() => {
            setIsMounted(true);
        });
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
                <Loader size="lg"/>
            </div>
        );
    }

    if (isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader size="lg"/>
            </div>
        );
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
            {/* hero */}
            <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial"/>
                <div className="container relative z-10 text-center">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6}}
                        className="mx-auto max-w-3xl"
                    >
                        <div
                            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground font-mono">
                            <Terminal className="h-3.5 w-3.5 text-primary"/>
                            <span>Le Linktree des développeurs</span>
                        </div>

                        <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-7xl">
                            Votre univers dev,
                            <br/>
                            <span className="text-primary">un seul lien.</span>
                        </h1>

                        <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
                            Regroupez vos projets GitHub, votre portfolio, vos compétences et tous vos liens en une page
                            unique pensée pour les développeurs web.
                        </p>

                        <div className="flex flex-col items-center gap-4">
                            <div className="relative w-full max-w-md">
                                <div
                                    className="flex items-center overflow-hidden rounded-xl border-2 border-border bg-card transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <span className="flex-shrink-0 pl-4 font-mono text-sm text-muted-foreground">
                    codebranch.dev/
                  </span>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => checkUsername(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleClaim()}
                                        placeholder="votre-nom"
                                        className="flex-1 bg-transparent py-3.5 pr-4 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
                                        maxLength={30}
                                    />
                                    <AnimatePresence mode="wait">
                                        {status !== "idle" && (
                                            <motion.div
                                                initial={{opacity: 0, scale: 0.5}}
                                                animate={{opacity: 1, scale: 1}}
                                                exit={{opacity: 0, scale: 0.5}}
                                                className="flex-shrink-0 pr-3"
                                            >
                                                {status === "checking" &&
                                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/>}
                                                {status === "available" && <Check className="h-5 w-5 text-primary"/>}
                                                {status === "taken" && <X className="h-5 w-5 text-destructive"/>}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <AnimatePresence>
                                    {status === "taken" && (
                                        <motion.p
                                            initial={{opacity: 0, y: -5}}
                                            animate={{opacity: 1, y: 0}}
                                            exit={{opacity: 0}}
                                            className="mt-2 text-sm text-destructive font-mono"
                                        >
                                            Ce nom est déjà pris — essayez-en un autre !
                                        </motion.p>
                                    )}
                                    {status === "available" && (
                                        <motion.p
                                            initial={{opacity: 0, y: -5}}
                                            animate={{opacity: 1, y: 0}}
                                            exit={{opacity: 0}}
                                            className="mt-2 text-sm text-primary font-mono"
                                        >
                                            ✓ Disponible — c&apos;est le vôtre !
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            <motion.button
                                onClick={handleClaim}
                                disabled={status !== "available"}
                                whileHover={status === "available" ? {scale: 1.03} : {}}
                                whileTap={status === "available" ? {scale: 0.97} : {}}
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-bold text-primary-foreground transition-all hover:glow-primary disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Zap className="h-5 w-5"/>
                                Créer mon CodeBranch
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
