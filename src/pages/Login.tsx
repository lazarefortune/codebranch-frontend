import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "@/api/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {Logo} from "@/components/Logo";

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
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="bg-gray-900 text-white hidden lg:flex flex-col justify-between p-10">
                <div />
                <blockquote className="text-2xl font-light leading-relaxed">
                    “Rejoins les branches du code, une ligne à la fois.”
                    <br />
                    <span className="text-sm text-gray-400 mt-2 block">— CodeBranch</span>
                </blockquote>
            </div>

            <div className="flex items-center justify-center p-6 lg:p-16 bg-white">
                <div className="w-full max-w-md space-y-6">
                    <div className="w-full flex justify-center items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <Logo />
                        </Link>
                    </div>

                    <div className="text-center space-y-1">
                        <h1 className="text-xl font-semibold">Connecte-toi</h1>
                        <p className="text-gray-600 text-sm">
                            Accède à tous tes liens dev personnalisés.
                        </p>
                    </div>

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
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full mt-2">
                            Se connecter
                        </Button>
                    </form>

                    <p className="text-sm text-center text-gray-600">
                        Pas encore de compte ?{" "}
                        <Link to="/inscription" className="text-blue-600 hover:underline font-medium">
                            Créer un compte
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
