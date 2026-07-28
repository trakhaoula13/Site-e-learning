import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getInstructor, updateInstructor } from "../services/instructorService";
import { getCourseByInstructor } from "../services/courseService";
import { BACKEND_ORIGIN } from "../services/api";
import CourseCard from "../components/CourseCard";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { User, Mail, ArrowLeft, BookOpen, ImagePlus, Save, ShieldCheck } from "lucide-react";

function InstructorDetails() {
    const { id } = useParams();
    const { isAdmin, currentInstructorId } = useContext(AuthContext);
    const { showToast } = useToast();

    const [instructor, setInstructor] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({ name: "", lastname: "", bio: "", role: "instructor" });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const canEdit = isAdmin || currentInstructorId === id;

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const instructorRes = await getInstructor(id);
            setInstructor(instructorRes.data);
            setFormData({
                name: instructorRes.data.name || "",
                lastname: instructorRes.data.lastname || "",
                bio: instructorRes.data.bio || "",
                role: instructorRes.data.role || "instructor",
            });
            const coursesRes = await getCourseByInstructor(id);
            setCourses(coursesRes.data);
        } catch (error) {
            setError("Impossible de charger ce profil");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleDeleteCourse = (courseId) => {
        setCourses((prev) => prev.filter((c) => c._id !== courseId));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = new FormData();
            payload.append("name", formData.name);
            payload.append("lastname", formData.lastname);
            payload.append("bio", formData.bio);
            if (isAdmin) payload.append("role", formData.role);
            if (imageFile) payload.append("image", imageFile);

            const res = await updateInstructor(id, payload);
            setInstructor(res.data);
            setImageFile(null);
            showToast("Profil mis à jour", "success");
        } catch (error) {
            showToast("Impossible de mettre à jour ce profil", "error");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="alert alert-info text-center">Chargement...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center">{error}</div>
            </div>
        );
    }

    const avatarSrc = imagePreview || (instructor.image ? `${BACKEND_ORIGIN}${instructor.image}` : null);

    return (
        <div className="container mt-4">
            {isAdmin && (
                <Link to="/instructors" className="btn btn-secondary mb-3">
                    <ArrowLeft size={18} /> Retour
                </Link>
            )}

            <div className="card shadow mb-4">
                <div className="card-body">
                    {canEdit ? (
                        <form onSubmit={handleSave}>
                            <div className="text-center mb-3">
                                <label htmlFor="image-upload" style={{ cursor: "pointer" }}>
                                    {avatarSrc ? (
                                        <img src={avatarSrc} alt={instructor.name} className="rounded-circle" width={110} height={110} style={{ objectFit: "cover" }} />
                                    ) : (
                                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto" style={{ width: 110, height: 110 }}>
                                            <ImagePlus size={30} className="text-muted" />
                                        </div>
                                    )}
                                </label>
                                <input id="image-upload" type="file" accept="image/*" className="d-none" onChange={handleImageChange} />
                                <div><small className="text-muted">Cliquez pour changer la photo</small></div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><User size={18} /> Prénom</label>
                                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><User size={18} /> Nom</label>
                                    <input type="text" className="form-control" name="lastname" value={formData.lastname} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label"><Mail size={18} /> Email</label>
                                <input type="email" className="form-control" value={instructor.email} disabled />
                                <small className="text-muted">L'email ne peut pas être modifié ici.</small>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Bio</label>
                                <textarea rows={3} className="form-control" name="bio" value={formData.bio} onChange={handleChange} />
                            </div>

                            {isAdmin && (
                                <div className="mb-3">
                                    <label className="form-label"><ShieldCheck size={18} /> Rôle</label>
                                    <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                                        <option value="instructor">Instructeur</option>
                                        <option value="admin">Administrateur</option>
                                    </select>
                                </div>
                            )}

                            <button className="btn btn-primary" type="submit" disabled={isSaving}>
                                <Save size={16} className="me-2" /> {isSaving ? "Enregistrement..." : "Enregistrer"}
                            </button>
                        </form>
                    ) : (
                        <>
                            <div className="text-center mb-3">
                                {avatarSrc ? (
                                    <img src={avatarSrc} alt={instructor.name} className="rounded-circle" width={110} height={110} style={{ objectFit: "cover" }} />
                                ) : (
                                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto" style={{ width: 110, height: 110 }}>
                                        <User size={30} className="text-muted" />
                                    </div>
                                )}
                            </div>
                            <h2 className="text-center">
                                {instructor.name} {instructor.lastname}
                            </h2>
                            <p className="text-center mb-1">
                                <Mail size={18} className="me-2" />
                                {instructor.email}
                            </p>
                            <p className="text-center text-muted">{instructor.bio}</p>
                        </>
                    )}
                </div>
            </div>

            <h4 className="mb-3">
                <BookOpen size={20} className="me-2" />
                Cours de {instructor.name}
            </h4>

            {courses.length === 0 && (
                <div className="alert alert-warning">Cet instructeur n'a pas encore de cours</div>
            )}

            <div className="row">
                {courses.map((course) => (
                    <CourseCard key={course._id} course={course} onDelete={handleDeleteCourse} />
                ))}
            </div>
        </div>
    );
}

export default InstructorDetails;

