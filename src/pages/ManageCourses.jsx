import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses, deleteCours } from "../services/courseService";
import { useToast } from "../context/ToastContext";
import { Settings, Pencil, Trash2, PlusCircle } from "lucide-react";

function ManageCourses() {
    const { showToast } = useToast();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await getCourses();
            setCourses(response.data);
        } catch (error) {
            setError("Erreur lors de la récupération des cours");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (course) => {
        if (!window.confirm(`Supprimer le cours "${course.title}" ?`)) return;
        try {
            await deleteCours(course._id);
            showToast("Cours supprimé", "success");
            setCourses((prev) => prev.filter((c) => c._id !== course._id));
        } catch (error) {
            showToast("Impossible de supprimer ce cours", "error");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h2 className="mb-0">
                    <Settings className="me-2" /> Gérer les cours
                </h2>
                <Link to="/add-course" className="btn btn-warning text-white">
                    <PlusCircle size={18} className="me-1" /> Ajouter un cours
                </Link>
            </div>

            {loading && <div className="alert alert-info text-center">Chargement...</div>}
            {error && <div className="alert alert-danger text-center">{error}</div>}

            {!loading && !error && (
                <div className="card shadow">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Titre</th>
                                    <th>Instructeur</th>
                                    <th>Prix</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course._id}>
                                        <td>{course.title}</td>
                                        <td>
                                            {course.instructorId
                                                ? `${course.instructorId.name || ""} ${course.instructorId.lastname || ""}`
                                                : "—"}
                                        </td>
                                        <td>{course.price} DT</td>
                                        <td className="text-end">
                                            <div className="d-flex gap-2 justify-content-end">
                                                <Link to={`/edit-course/${course._id}`} className="btn btn-outline-dark btn-sm">
                                                    <Pencil size={14} className="me-1" /> Modifier
                                                </Link>
                                                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(course)}>
                                                    <Trash2 size={14} className="me-1" /> Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {courses.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted py-4">Aucun cours pour le moment</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageCourses;

