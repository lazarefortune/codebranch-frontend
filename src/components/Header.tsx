import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
    return (
        <header className="bg-white shadow-sm mb-6">
            <div className="container flex justify-between items-center py-4">
                <Link to="/" className="text-xl font-bold text-blue-600">
                    CodeBranch
                </Link>
                <div className="space-x-2">
                    <Button variant="ghost" asChild>
                        <Link to="/connexion">Connexion</Link>
                    </Button>
                    <Button asChild>
                        <Link to="/inscription">Inscription</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;
