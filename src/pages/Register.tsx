import { useState } from "react";
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
        <div className="max-w-md mx-auto bg-white p-8 rounded shadow space-y-6">
            <h1 className="text-2xl font-bold text-center">Inscription</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <Label htmlFor="username">Nom</Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="ex : Jonh Doe"
                        required={true}
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
                        required={true}
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
                        required={true}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <Button type="submit" className="w-full">
                    S’inscrire
                </Button>
            </form>

            <p className="text-sm text-center">
                Déjà un compte ?{" "}
                <Link to="/connexion" className="text-blue-600 hover:underline">
                    Se connecter
                </Link>
            </p>
        </div>
    );
};

export default Register;
