import {Navigate, Outlet} from "react-router-dom";

const PrivateRoute = () => {
    const token = localStorage.getItem('token')

    if (!token) {
        return <Navigate to="/connexion"/>
    }

    return <Outlet/>
}

export default PrivateRoute