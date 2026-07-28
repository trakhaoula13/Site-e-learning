import { useContext, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { getInstructors } from "../services/instructorService";
import InstructorCard from "../components/InstructorCard";
import PageBanner from "../components/PageBanner";
import { AuthContext } from "../context/AuthContext";
import { Users, Search, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 6;

function Instructors() {
    const { isAdmin, currentInstructorId } = useContext(AuthContext);

    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchInstructors();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [search]);

    const fetchInstructors = async () => {
        try {
            const reponse = await getInstructors();
            setInstructors(reponse.data);
        } catch (error) {
            setError("Impossible de charger les instructeurs");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        setInstructors((prev) => prev.filter((i) => i._id !== id));
    };

    const filtered = useMemo(() => {
        return instructors.filter((i) =>
            `${i.name} ${i.lastname}`.toLowerCase().includes(search.toLowerCase())
        );
    }, [instructors, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Un instructeur (non-admin) est directement redirigé vers son propre profil
    if (!isAdmin && currentInstructorId) {
        return <Navigate to={`/instructors/${currentInstructorId}`} replace />;
    }

    return (
        <>
            <PageBanner title="Nos instructeurs" subtitle="Des professionnels expérimentés dans leur domaine" />
            <div className="container mt-4">

            <div className="row justify-content-center mb-4">
                <div className="col-md-6">
                    <div className="input-group">
                        <span className="input-group-text bg-white"><Search size={18} /></span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Rechercher un instructeur..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {error && <div className="alert alert-danger text-center">{error}</div>}

            <div className="row">
                {loading &&
                    [...Array(3)].map((_, i) => (
                        <div className="col-md-4 mb-4" key={i}>
                            <div className="card skeleton-card h-100"></div>
                        </div>
                    ))
                }

                {!loading && filtered.length === 0 && !error && (
                    <div className="col-12">
                        <div className="alert alert-warning text-center">Aucun instructeur trouvé</div>
                    </div>
                )}

                {!loading && visible.map((instructor) => (
                    <InstructorCard key={instructor._id} instructor={instructor} onDelete={handleDelete} />
                ))}
            </div>

            {!loading && totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-3 mb-5">
                    <button className="btn btn-outline-dark btn-sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                        <ChevronLeft size={16} /> Précédent
                    </button>
                    <span className="text-muted">Page {page} / {totalPages}</span>
                    <button className="btn btn-outline-dark btn-sm" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                        Suivant <ChevronRight size={16} />
                    </button>
                </div>
            )}
            </div>
        </>
    );
}

export default Instructors;