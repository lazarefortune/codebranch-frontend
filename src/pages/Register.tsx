import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Registering with:", { username, email, password });
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
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-center block text-2xl font-bold tracking-tight text-blue-900"
                    >
                        CODEBRANCH
                    </Link>

                    {/* Accroche */}
                    <div className="text-center space-y-1">
                        <h1 className="text-xl font-semibold">Crée ton compte</h1>
                        <p className="text-gray-600 text-sm">
                            Centralise tous tes liens dev en un seul endroit.
                        </p>
                    </div>

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit} className="space-y-4">
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

                    {/* Footer */}
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
