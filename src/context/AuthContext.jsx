import { createContext, useState } from "react";
import { decodeToken } from "../utils/decodeToken";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const login = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    const payload = decodeToken(token);
    const currentInstructorId = payload?.id || null;
    const role = payload?.role || null;
    const isAdmin = role === "admin";

    return (
        <AuthContext.Provider value={{
            token, login, logout,
            isAuthenticated: !!token,
            currentInstructorId,
            role,
            isAdmin,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;

