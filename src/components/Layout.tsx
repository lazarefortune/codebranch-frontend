import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Header />
            <main className="container">
                <Outlet />
            </main>
            <footer className="py-6 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} CodeBranch. Tous droits réservés.
            </footer>
        </div>
    );
};

export default Layout;
