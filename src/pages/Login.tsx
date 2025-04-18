import { Link , useNavigate } from "react-router-dom";
import {useState} from "react";
import * as React from "react";
import {login} from "../api/auth.ts";

const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('')

        try {
            const data = await login(email, password);

            localStorage.setItem('token', data.access_token)

            navigate('/dashboard')
        } catch (error: any) {
            console.log(error)
            setError("Email ou mot de passe incorrect")
        }
    }

    return (
        <>
            <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
                <h1 className="title">Connexion</h1>

                <form onSubmit={handleSubmit}>
                    {error && <div className="bg-red-50 rounded p-3 text-center my-2">
                        <p className="form-error">{error}</p>
                    </div>}

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input id="email" type="email" className="form-input" onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Mot de passe</label>
                        <input id="password" type="password" className="form-input" onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <button type="submit" className="btn btn-primary w-full">Se connecter</button>
                </form>

                <p className="text-sm text-center mt-4">
                    Pas encore de compte ?{" "}
                    <Link to="/inscription" className="text-blue-600 hover:underline">Créer un compte</Link>
                </p>
            </div>
        </>
    );
};

export default Login;
