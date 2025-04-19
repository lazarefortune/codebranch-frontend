import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Layout from "../components/Layout.tsx";
import Login from "../pages/Login.tsx";
import Register from "../pages/Register.tsx";
import PrivateRoute from "@/components/auth/PrivateRoute";
import Dashboard from "@/pages/Dashboard";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    {/* Public */}
                    <Route path="/" element={<Home />} />
                    <Route path="/connexion" element={<Login />} />
                    <Route path="/inscription" element={<Register />} />

                    {/* Private */}
                    <Route element={<PrivateRoute/>}>
                        <Route path="/dashboard" element={<Dashboard/>}/>
                    </Route>

                    {/* Error */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
