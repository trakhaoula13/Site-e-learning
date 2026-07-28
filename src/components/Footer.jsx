import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-dark text-white py-3 mt-5">
            <div className="container d-flex flex-wrap justify-content-between align-items-center small gap-2">
                <span className="d-flex align-items-center">
                    <BookOpen size={16} className="me-2" /> E-learning Platform
                </span>

                <span className="text-white-50">&copy; 2026 E-learning. Tous droits réservés</span>
            </div>
        </footer>
    );
}

export default Footer;

