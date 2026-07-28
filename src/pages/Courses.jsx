import { useEffect, useMemo, useState } from "react";
import { getCourses } from "../services/courseService";
import CourseCard from "../components/CourseCard";
import PageBanner from "../components/PageBanner";
import { BookOpen, Search, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 6;

function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("recent");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [page, setPage] = useState(1);

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

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleDelete = (id) => {
        setCourses((prev) => prev.filter((c) => c._id !== id));
    };

    // recommence à la page 1 dès qu'un filtre change
    useEffect(() => {
        setPage(1);
    }, [search, sortBy, minPrice, maxPrice]);

    const filteredCourses = useMemo(() => {
        let list = courses.filter((c) =>
            c.title?.toLowerCase().includes(search.toLowerCase())
        );
        if (minPrice !== "") list = list.filter((c) => c.price >= Number(minPrice));
        if (maxPrice !== "") list = list.filter((c) => c.price <= Number(maxPrice));
        if (sortBy === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
        if (sortBy === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
        if (sortBy === "title") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
        return list;
    }, [courses, search, sortBy, minPrice, maxPrice]);

    const totalPages = Math.max(1, Math.ceil(filteredCourses.length / PAGE_SIZE));
    const visibleCourses = filteredCourses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <>
            {/* Remplace imageUrl par une vraie photo une fois choisie sur Unsplash/Pexels */}
            <PageBanner title="Nos Cours" subtitle="Découvrez notre catalogue de formations en présentiel" />
            <div className="container mt-5">

            {/* Recherche, tri et filtre de prix */}
            <div className="row justify-content-center mb-4 g-2">
                <div className="col-md-4">
                    <div className="input-group">
                        <span className="input-group-text bg-white"><Search size={18} /></span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Rechercher un cours..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-2">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Prix min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                </div>
                <div className="col-md-2">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Prix max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="recent">Plus récents</option>
                        <option value="price_asc">Prix croissant</option>
                        <option value="price_desc">Prix décroissant</option>
                        <option value="title">Titre (A-Z)</option>
                    </select>
                </div>
            </div>

            {error && <div className="alert alert-danger text-center">{error}</div>}

            {loading && (
                <div className="row">
                    {[...Array(3)].map((_, i) => (
                        <div className="col-md-4 mb-4" key={i}>
                            <div className="card skeleton-card h-100"></div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && !error && filteredCourses.length === 0 && (
                <div className="alert alert-warning text-center">Aucun cours trouvé</div>
            )}

            <div className="row">
                {visibleCourses.map((course) => (
                    <CourseCard key={course._id} course={course} onDelete={handleDelete} />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-3 mt-3 mb-5">
                    <button
                        className="btn btn-outline-dark btn-sm"
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        <ChevronLeft size={16} /> Précédent
                    </button>
                    <span className="text-muted">Page {page} / {totalPages}</span>
                    <button
                        className="btn btn-outline-dark btn-sm"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                        Suivant <ChevronRight size={16} />
                    </button>
                </div>
            )}
            </div>
        </>
    );
}

export default Courses;