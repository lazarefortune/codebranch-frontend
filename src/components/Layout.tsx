import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Header />
            <main className="container pb-10">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
