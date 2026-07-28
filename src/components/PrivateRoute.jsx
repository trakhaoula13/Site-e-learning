import {Navigate} from "react-router-dom" 
//composition qui pretège les routes privées en vérifiant si l'utilisateur est connecré

function PrivateRoute({children}) {
    //récupérer le token d'authentification depuis le localStorage
    const token = localStorage.getItem("token");
    
    
    //si auctun token n'est trouvé, rediriger l'utilisateur vers la page de connexion 
    if(!token) {
        return <Navigate to = "/login" replace />;
    }
    return children
}

export default PrivateRoute;