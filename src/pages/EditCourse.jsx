import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourse, updateCourse } from "../services/courseService";
import { getInstructors } from "../services/instructorService";
import { useToast } from "../context/ToastContext";
import { BookOpen, DollarSign, FileText, User, Tag, SaveAllIcon } from "lucide-react";

function EditCourse() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [instructors, setInstructors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState({
        title: "", description: "", content: "", price: "", instructorId: "", tags: ""
    });

    useEffect(() => {
        fetchInstructors();
        fetchCourse();
    }, []);

    const fetchInstructors = async () => {
        try {
            const reponse = await getInstructors();
            setInstructors(reponse.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCourse = async () => {
        try {
            const reponse = await getCourse(id);
            const data = reponse.data;
            setCourse({
                ...data,
                tags: Array.isArray(data.tags) ? data.tags.join(", ") : data.tags,
                instructorId: data.instructorId?._id || data.instructorId || ""
            });
        } catch (error) {
            showToast("Impossible de charger ce cours", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateCourse(id, {
                ...course,
                tags: course.tags.split(",").map(tag => tag.trim()).filter(Boolean)
            });
            showToast("Cours mis à jour", "success");
            navigate("/courses");
        } catch (error) {
            showToast("Impossible de mettre à jour ce cours", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="alert alert-info text-center">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-body">
                    <h2 className="mb-4">
                        <BookOpen className="me-2" />
                        Modifier le cours
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Titre</label>
                            <input type="text" className="form-control" name="title" value={course.title} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label"><FileText size={18} /> Description</label>
                            <textarea className="form-control" name="description" rows={3} value={course.description} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label"><FileText size={18} /> Contenu</label>
                            <textarea className="form-control" name="content" rows={5} value={course.content} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label"><DollarSign size={18} /> Prix</label>
                            <input type="number" className="form-control" name="price" value={course.price} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label"><User size={18} /> Instructeur</label>
                            <select className="form-select" name="instructorId" value={course.instructorId} onChange={handleChange}>
                                <option value=""> Choisir un instructeur</option>
                                {instructors.map((instructor) => (
                                    <option key={instructor._id} value={instructor._id}>
                                        {instructor.name} {instructor.lastname}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label"><Tag size={18} /> Tags</label>
                            <input type="text" className="form-control" name="tags" placeholder="React, Bootstrap" value={course.tags} onChange={handleChange} />
                            <small className="text-muted">Séparez les tags par des virgules</small>
                        </div>
                        <button className="btn btn-success" type="submit" disabled={isSubmitting}>
                            <SaveAllIcon size={18} className="me-2" /> {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditCourse;

