import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Protège les routes réservées aux administrateurs
function AdminRoute({ children }) {
    const { isAuthenticated, isAdmin } = useContext(AuthContext);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    if (!isAdmin) {
        return <Navigate to="/courses" replace />;
    }
    return children;
}

export default AdminRoute;
