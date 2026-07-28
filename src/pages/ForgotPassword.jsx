import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/instructorService";
import { sendPasswordResetEmail } from "../utils/emailjs";
import { useToast } from "../context/ToastContext";
import { Mail, KeyRound } from "lucide-react";

function ForgotPassword() {
    const { showToast } = useToast();
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            const res = await forgotPassword(email);
            const { resetToken } = res.data;
            const resetLink = `${window.location.origin}/reset-password/${resetToken}`;
            await sendPasswordResetEmail({
                email: email,
                link: resetLink,
            });
            setSent(true);
        } catch (error) {
            setError(error.response?.data?.message || "Impossible d'envoyer l'email");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow p-4">
                        <h2 className="text-center mb-4"><KeyRound className="me-2" /> Mot de passe oublié</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        {sent ? (
                            <div className="alert alert-success">
                                Un email contenant un lien de réinitialisation a été envoyé à {email}.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label"><Mail size={18} /> Email</label>
                                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Envoi..." : "Envoyer le lien"}
                                </button>
                            </form>
                        )}
                        <p className="text-center mt-3">
                            <Link to="/login">Retour à la connexion</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;