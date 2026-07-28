import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../services/instructorService";
import { useToast } from "../context/ToastContext";
import { Lock, KeyRound } from "lucide-react";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (password !== confirm) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }
        setIsSubmitting(true);
        try {
            await resetPassword(token, password);
            showToast("Mot de passe réinitialisé, vous pouvez vous connecter", "success");
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Lien invalide ou expiré");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow p-4">
                        <h2 className="text-center mb-4"><KeyRound className="me-2" /> Nouveau mot de passe</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label"><Lock size={18} /> Nouveau mot de passe</label>
                                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label"><Lock size={18} /> Confirmer le mot de passe</label>
                                <input type="password" className="form-control" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} />
                            </div>
                            <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
                            </button>
                        </form>
                        <p className="text-center mt-3"><Link to="/login">Retour à la connexion</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
