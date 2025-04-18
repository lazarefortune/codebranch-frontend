import { useState } from "react";
import { Link } from "react-router-dom";
import { MenuIcon, XIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type NavLinkType = {
    to: string;
    label: string;
};

const navLinks: NavLinkType[] = [
    { to: "/", label: "Accueil" },
    { to: "/connexion", label: "Connexion" },
    { to: "/inscription", label: "Inscription" },
];

const Header = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleMenu = () => setMobileOpen((prev) => !prev);
    const closeMenu = () => setMobileOpen(false);

    const NavLink = ({ to, label }: NavLinkType) => (
        <Link
            to={to}
            onClick={closeMenu}
            className="text-gray-700 hover:text-blue-600 transition-colors block"
        >
            {label}
        </Link>
    );

    return (
        <header className="bg-white shadow relative z-50">
            <div className="container flex items-center justify-between py-4">
                {/* Logo */}
                <Link to="/" className="text-xl font-bold text-blue-600">
                    CodeBranch
                </Link>

                {/* Desktop nav */}
                <nav className="hidden lg:flex space-x-6">
                    {navLinks.map((link) => (
                        <NavLink key={link.to} {...link} />
                    ))}
                </nav>

                {/* Mobile toggle button */}
                <button
                    onClick={toggleMenu}
                    className="lg:hidden inline-flex items-center justify-center p-2.5 rounded-md text-gray-700 hover:bg-gray-100"
                    aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
                >
                    {mobileOpen ? (
                        <XIcon className="h-6 w-6" />
                    ) : (
                        <MenuIcon className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile nav with animation */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="lg:hidden absolute top-full left-0 w-full bg-white shadow-md"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <nav className="flex flex-col px-4 py-3 space-y-3">
                            {navLinks.map((link) => (
                                <NavLink key={link.to} {...link} />
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
