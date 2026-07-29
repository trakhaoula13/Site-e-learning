import { useContext } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Pencil, Trash2 } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { deleteCours } from "../services/courseService";

function CourseCard({ course, onDelete }) {
    const { isAdmin } = useContext(AuthContext);
    const { showToast } = useToast();

    const handleDelete = async () => {
        if (!window.confirm(`Supprimer le cours "${course.title}" ?`)) return;
        try {
            await deleteCours(course._id);
            showToast("Cours supprimé", "success");
            onDelete && onDelete(course._id);
        } catch (error) {
            showToast("Impossible de supprimer ce cours", "error");
        }
    };

    return (
        <div className="col-md-4 mb-4">
            <div className="card h-100 shadow">
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">
                        <BookOpen size={20} className="me-2" />
                        {course.title}
                    </h5>
                    <p>{course.description}</p>

                    <div className="price-stamp">
                        {course.price}
                        <small>DT</small>
                    </div>

                    <Link to={`/courses/${course._id}`} className="btn btn-primary mt-auto">
                        Voir les détails
                    </Link>

                    {/* Modifier/Supprimer : réservé à l'admin uniquement */}
                    {isAdmin && (
                        <div className="d-flex gap-2 mt-2">
                            <Link to={`/edit-course/${course._id}`} className="btn btn-outline-dark btn-sm flex-fill">
                                <Pencil size={14} className="me-1" /> Modifier
                            </Link>
                            <button className="btn btn-outline-danger btn-sm flex-fill" onClick={handleDelete}>
                                <Trash2 size={14} className="me-1" /> Supprimer
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CourseCard;