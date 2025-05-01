import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getMe } from "@/api/auth";
import { Logo } from "@/components/Logo"; // 👈 on importe ton Logo
import { Menu } from "lucide-react"; // 👈 icône burger pour mobile
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // 👈 composant Drawer shadcn

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
            getMe()
                .then((user) => {
                    setUsername(user.username);
                })
                .catch(() => {
                    localStorage.removeItem("token");
                    setIsAuthenticated(false);
                    setUsername(null);
                });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUsername(null);
        navigate("/connexion");
    };

    return (
        <header className="bg-white dark:bg-gray-950 border-b">
            <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-0">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <Logo />
                </Link>

                {/* Desktop navigation */}
                <div className="hidden md:flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
              <span className="text-gray-700 dark:text-gray-300 text-sm hidden sm:inline">
                Bienvenue, <strong>{username}</strong>
              </span>
                            <Button variant="outline" onClick={handleLogout}>
                                Déconnexion
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link to="/connexion">Connexion</Link>
                            </Button>
                            <Button asChild>
                                <Link to="/inscription">Inscription</Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile navigation */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="flex flex-col gap-4 p-6">
                            {isAuthenticated ? (
                                <>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    Bienvenue, <strong>{username}</strong>
                  </span>
                                    <Button variant="outline" onClick={handleLogout}>
                                        Déconnexion
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="ghost" asChild>
                                        <Link to="/connexion">Connexion</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link to="/inscription">Inscription</Link>
                                    </Button>
                                </>
                            )}
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
};

export default Header;
