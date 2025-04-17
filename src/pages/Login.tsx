import { Link } from "react-router-dom";

const Login = () => {
    return (
        <>
            <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
                <h1 className="title">Connexion</h1>

                <form>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input id="email" type="email" className="form-input" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Mot de passe</label>
                        <input id="password" type="password" className="form-input" />
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
