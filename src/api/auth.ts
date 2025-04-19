import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const login = async (email:string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
    });

    return response.data;
}