import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, PlusCircle, Eye, Settings, UserPlus } from "lucide-react";
import { getCourses } from "../services/courseService";
import { getInstructors } from "../services/instructorService";
import PageBanner from "../components/PageBanner";

function Dashboard() {
    const [courseCount, setCourseCount] = useState(0);
    const [instructorCount, setInstructorCount] = useState(0);

    useEffect(() => {
        fetchCounts();
    }, []);

    const fetchCounts = async () => {
        try {
            const coursesRes = await getCourses();
            setCourseCount(coursesRes.data.length);
        } catch (error) {
            console.log(error);
        }
        try {
            const instructorsRes = await getInstructors();
            setInstructorCount(instructorsRes.data.length);
        } catch (error) {
            console.log(error);
        }
    };

    const cards = [
        { icon: BookOpen, label: "Cours", value: courseCount, action: "Voir", to: "/courses", variant: "primary" },
        { icon: Users, label: "Instructeurs", value: instructorCount, action: "Voir", to: "/instructors", variant: "primary" },
        { icon: PlusCircle, label: "Ajouter un cours", value: null, action: "Ajouter", to: "/add-course", variant: "warning" },
        { icon: Settings, label: "Gérer les cours", value: null, action: "Gérer", to: "/manage-courses", variant: "danger" },
        { icon: UserPlus, label: "Nouveau compte", value: null, action: "Créer", to: "/add-instructor", variant: "primary" },
    ];

    return (
        <>
            <PageBanner title="Tableau de bord" subtitle="Gérez vos cours et instructeurs en un coup d'œil" />

            <div className="container mt-4 mb-5">
                <div className="row g-3">
                    {cards.map((card, i) => (
                        <div className="col-md-3" key={i}>
                            <div className="card shadow text-center h-100">
                                <div className="card-body d-flex flex-column align-items-center">
                                    <div className={`dashboard-icon-badge dashboard-icon-${card.variant} mb-3`}>
                                        <card.icon size={26} />
                                    </div>
                                    <h5>{card.label}</h5>
                                    {card.value !== null && <h2>{card.value}</h2>}
                                    <Link to={card.to} className={`btn btn-${card.variant} mt-auto w-100`}>
                                        {card.action === "Voir" && <Eye size={16} className="me-1" />}
                                        {card.action}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Dashboard;