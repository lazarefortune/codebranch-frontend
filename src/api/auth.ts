import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const login = async (email:string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error during login:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers,
            });
        } else {
            console.error("Unexpected error during login:", error);
        }
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const errorMessage = error.response?.data?.message || "An error occurred during login.";
            throw new Error(`Failed to log in. Status: ${status}. Message: ${errorMessage}`);
        } else {
            throw new Error("Failed to log in. Please check your credentials and try again.");
        }
    }
}