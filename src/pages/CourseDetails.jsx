import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCourse } from "../services/courseService";
import { BookOpen, DollarSign, User, Mail, Tag, FileText, ArrowLeft } from "lucide-react";

function CourseDetails() {
    const { id } = useParams();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCourseDetails = async () => {
        try {
            const reponse = await getCourse(id);
            setCourse(reponse.data);
        } catch (error) {
            setError("Impossible de charger ce cours");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseDetails();
    }, []);

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="alert alert-info">Chargement...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <Link to="/courses" className="btn btn-secondary mb-3">
                <ArrowLeft size={18} /> Retour
            </Link>
            <div className="card shadow">
                <div className="card-body">
                    <h2 className="card-title">
                        <BookOpen size={18} className="text-primary" />
                        {course.title}
                    </h2>
                    <hr />
                    <h5><FileText className="text-success" size={20} /> Description</h5>
                    <p>{course.description}</p>
                    <h5>
                        <BookOpen size={20} className="text-warning" />
                        Contenu
                    </h5>
                    <p>{course.content}</p>
                    <h5>
                        <DollarSign className="text-danger" size={20} />
                        Prix
                    </h5>
                    <p>{course.price} DT</p>
                    <h5>
                        <Tag className="text-info" size={20} />
                        Tags
                    </h5>
                    <div className="mb-3">
                        {course.tags && course.tags.map((tag, index) => (
                            <span key={index} className="badge bg-primary me-2">{tag}</span>
                        ))}
                    </div>
                    <hr />
                    <h4>Instructeur</h4>
                    {course.instructorId && (
                        <>
                            <p>
                                <User className="me-2" size={18} />
                                {course.instructorId.name} {course.instructorId.lastname}
                            </p>
                            <p>
                                <Mail className="me-2" size={18} />
                                {course.instructorId.email}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CourseDetails;

