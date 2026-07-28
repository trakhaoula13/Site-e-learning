import { useContext } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Trash2, ArrowRight } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { deleteInstructor } from "../services/instructorService";

function InstructorCard({ instructor, onDelete }) {
    const { isAdmin } = useContext(AuthContext);
    const { showToast } = useToast();

    const handleDelete = async () => {
        if (!window.confirm(`Supprimer ${instructor.name} ${instructor.lastname} ?`)) return;
        try {
            await deleteInstructor(instructor._id);
            showToast("Instructeur supprimé", "success");
            onDelete && onDelete(instructor._id);
        } catch (error) {
            showToast("Impossible de supprimer cet instructeur", "error");
        }
    };

    return (
        <div className="col-md-4 mb-4">
            <div className="card shadow h-100">
                <div className="card-body d-flex flex-column">
                    <h5>
                        <User size={20} className="me-2" />
                        {instructor.name} {instructor.lastname}
                        {instructor.role === "admin" && (
                            <span className="badge bg-dark ms-2 align-middle">Admin</span>
                        )}
                    </h5>
                    <p className="mb-1">
                        <Mail size={18} className="me-2" />
                        {instructor.email}
                    </p>
                    <p className="text-muted">{instructor.bio}</p>

                    <Link to={`/instructors/${instructor._id}`} className="btn btn-primary mt-auto">
                        Voir le profil <ArrowRight size={16} className="ms-1" />
                    </Link>

                    {isAdmin && (
                        <button className="btn btn-outline-danger btn-sm mt-2" onClick={handleDelete}>
                            <Trash2 size={14} className="me-1" /> Supprimer
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InstructorCard;

