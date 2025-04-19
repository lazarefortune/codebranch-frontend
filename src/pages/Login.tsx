import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "@/api/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const data = await login(email, password);
            localStorage.setItem("token", data.access_token);
            navigate("/dashboard");
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Une erreur est survenue";
            console.error(message);
            setError("Email ou mot de passe incorrect");
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded shadow space-y-6">
            <h1 className="text-2xl font-bold text-center">Connexion</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.dev"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    />
                </div>

                <Button type="submit" className="w-full">
                    Se connecter
                </Button>
            </form>

            <p className="text-sm text-center">
                Pas encore de compte ?{" "}
                <Link to="/inscription" className="text-blue-600 hover:underline">
                    Créer un compte
                </Link>
            </p>
        </div>
    );
};

export default Login;
