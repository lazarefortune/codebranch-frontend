import { Link } from "react-router-dom";

const Register = () => {
    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
            <h1 className="title">Inscription</h1>

            <form>
                <div className="form-group">
                    <label htmlFor="username" className="form-label">Nom d'utilisateur</label>
                    <input id="username" type="text" className="form-input" />
                </div>

                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input id="email" type="email" className="form-input" />
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label">Mot de passe</label>
                    <input id="password" type="password" className="form-input" />
                </div>

                <button type="submit" className="btn btn-primary w-full">S’inscrire</button>
            </form>

            <p className="text-sm text-center mt-4">
                Déjà un compte ?{" "}
                <Link to="/connexion" className="text-blue-600 hover:underline">Se connecter</Link>
            </p>
        </div>
    );
};

export default Register;
