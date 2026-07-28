import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCourse } from "../services/courseService";
import { getInstructors } from "../services/instructorService";
import { useToast } from "../context/ToastContext";
import PageBanner from "../components/PageBanner";
import { BookOpen, DollarSign, FileText, User, Tag, SaveAll } from "lucide-react";

function AddCourse() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [instructors, setInstructors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [course, setCourse] = useState({
        title: "", description: "", content: "", price: "", instructorId: "", tags: ""
    });

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        try {
            const reponse = await getInstructors();
            setInstructors(reponse.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addCourse({
                ...course,
                tags: course.tags.split(",").map(tag => tag.trim()).filter(Boolean)
            });
            showToast("Cours ajouté avec succès", "success");
            navigate("/courses");
        } catch (error) {
            showToast("Impossible d'ajouter ce cours", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <PageBanner title="Ajouter un cours" subtitle="Créez une nouvelle formation pour votre catalogue" />

            <div className="container mt-4 mb-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow">
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label"><BookOpen size={16} className="me-1" /> Titre</label>
                                        <input type="text" className="form-control" name="title" value={course.title} onChange={handleChange} placeholder="Ex : Introduction à React" required />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label"><FileText size={18} /> Description</label>
                                        <textarea className="form-control" name="description" rows={3} value={course.description} onChange={handleChange} placeholder="Résumé court affiché sur la carte du cours" required />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label"><FileText size={18} /> Contenu</label>
                                        <textarea className="form-control" name="content" rows={5} value={course.content} onChange={handleChange} placeholder="Programme détaillé du cours" required />
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label"><DollarSign size={18} /> Prix (DT)</label>
                                            <input type="number" className="form-control" name="price" value={course.price} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label"><User size={18} /> Instructeur</label>
                                            <select className="form-select" name="instructorId" value={course.instructorId} onChange={handleChange} required>
                                                <option value=""> Choisir un instructeur</option>
                                                {instructors.map((instructor) => (
                                                    <option key={instructor._id} value={instructor._id}>
                                                        {instructor.name} {instructor.lastname}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label"><Tag size={18} /> Tags</label>
                                        <input type="text" className="form-control" name="tags" placeholder="React, Bootstrap" value={course.tags} onChange={handleChange} />
                                        <small className="text-muted">Séparez les tags par des virgules</small>
                                    </div>

                                    <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
                                        <SaveAll size={18} className="me-2" /> {isSubmitting ? "Enregistrement..." : "Enregistrer le cours"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddCourse;