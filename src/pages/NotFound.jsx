import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="container mt-5">
            <div className="text-center">
                <span className="notfound-stamp">NON TROUVÉ</span>
                <h1 className="display-1 fw-bold">404</h1>
                <h3>Page introuvable</h3>
                <p>Désolé, la page que vous recherchez n'existe pas</p>
                <Link to="/" className="btn btn-primary">
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
}

export default NotFound;

