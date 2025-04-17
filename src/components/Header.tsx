import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="bg-white shadow mb-6">
            <div className="container flex items-center justify-between py-4">
                <Link to="/" className="text-xl font-bold text-blue-600">CodeBranch</Link>
                <nav className="space-x-4">
                    <Link to="/" className="text-gray-700 hover:text-blue-600">Accueil</Link>
                    <Link to="/connexion" className="text-gray-700 hover:text-blue-600">Connexion</Link>
                    <Link to="/inscription" className="text-gray-700 hover:text-blue-600">Inscription</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
