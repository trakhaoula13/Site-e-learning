import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, ArrowRight, Award } from "lucide-react";
import { getCourses } from "../services/courseService";
import CourseCard from "../components/CourseCard";

function Home() {
    const [featured, setFeatured] = useState([]);

    useEffect(() => {
        fetchFeatured();
    }, []);

    const fetchFeatured = async () => {
        try {
            const coursesRes = await getCourses();
            setFeatured(coursesRes.data.slice(0, 3));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="hero-notebook text-white text-center py-5">
                <div className="container">
                    <h1 className="display-4 fw-bold">Bienvenue sur notre plateforme</h1>
                    <p className="lead mt-3">Apprenez quelque chose de nouveau chaque jour !</p>
                    <div className="d-flex gap-3 mt-4 flex-wrap justify-content-center">
                        <Link to="/courses" className="btn btn-light">
                            Explorer les cours <ArrowRight size={20} className="ms-2" />
                        </Link>
                    </div>
                </div>
            </div>

            {featured.length > 0 && (
                <div className="container mt-5">
                    <h2 className="text-center mb-4">Cours populaires</h2>
                    <div className="row">
                        {featured.map((course) => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                    <div className="text-center">
                        <Link to="/courses" className="btn btn-primary">
                            Voir tous les cours <ArrowRight size={20} className="ms-2" />
                        </Link>
                    </div>
                </div>
            )}

            <div className="container mt-5">
                <h1 className="text-center mb-4">Pourquoi nous choisir</h1>
                <div className="row">
                    <div className="col-md text-center mb-4">
                        <div className="card p-4 shadow h-100">
                            <BookOpen size={50} className="text-primary mb-3 mx-auto" />
                            <h4 className="mt-3">Contenu de qualité</h4>
                            <p>Accès professionnel à un large éventail de cours de qualité supérieure</p>
                        </div>
                    </div>

                    <div className="col-md text-center mb-4">
                        <div className="card p-4 shadow h-100">
                            <Users size={50} className="text-primary mb-3 mx-auto" />
                            <h4 className="mt-3">Instructeurs experts</h4>
                            <p>Apprenez de la part de professionnels expérimentés dans leur domaine</p>
                        </div>
                    </div>

                    <div className="col-md text-center mb-4">
                        <div className="card p-4 shadow h-100">
                            <Award size={50} className="text-primary mb-3 mx-auto" />
                            <h4 className="mt-3">Compétences professionnelles</h4>
                            <p>Développez des compétences professionnelles qui vous aideront à réussir dans votre carrière</p>
                        </div>
                    </div>
                </div>

                <div className="bg-light rounded shadow p-5 text-center mb-5">
                    <h2>Prêt à commencer à apprendre ?</h2>
                    <p className="lead mt-3">Découvrez des dizaines de cours pour développer vos compétences</p>
                    <Link to="/login" className="btn btn-primary mt-3">
                        Se connecter <ArrowRight size={20} className="ms-2" />
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Home;

