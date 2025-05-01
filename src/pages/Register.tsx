import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "@/api/auth"; // 👈 import API
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const data = await register(username, email, password);

            localStorage.setItem("token", data.access_token);

            navigate("/dashboard");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Une erreur est survenue";
            console.error(message);
            setError("Erreur lors de l'inscription. Vérifie tes informations.");
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Gauche */}
            <div className="bg-gray-900 text-white hidden lg:flex flex-col justify-between p-10">
                <div />
                <blockquote className="text-2xl font-light leading-relaxed">
                    “Un développeur qui ne pratique pas est comme un sabre qui rouille.”
                    <br />
                    <span className="text-sm text-gray-400 mt-2 block">— CodeBranch</span>
                </blockquote>
            </div>

            {/* Droite */}
            <div className="flex items-center justify-center p-6 lg:p-16 bg-white">
                <div className="w-full max-w-md space-y-6">
                    <Link to="/" className="text-center block text-2xl font-bold tracking-tight text-blue-900">
                        CODEBRANCH
                    </Link>

                    <div className="text-center space-y-1">
                        <h1 className="text-xl font-semibold">Crée ton compte</h1>
                        <p className="text-gray-600 text-sm">
                            Centralise tous tes liens dev en un seul endroit.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <Label htmlFor="username">Nom</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="ex : Jonh Doe"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="jonh@gmail.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <Button type="submit" className="w-full mt-2">
                            S’inscrire
                        </Button>
                    </form>

                    <p className="text-sm text-center text-gray-600">
                        Déjà un compte ?{" "}
                        <Link to="/connexion" className="text-blue-600 hover:underline font-medium">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
