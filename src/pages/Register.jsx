import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/instructorService";
import { useToast } from "../context/ToastContext";
import { User, Mail, Lock, FileText, UserPlus } from "lucide-react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Register() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: "", lastname: "", email: "", password: "", bio: ""
    });
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === "email") {
            setEmailError("");
        }
    };

    // validation au moment où l'utilisateur quitte le champ email
    const handleEmailBlur = () => {
        if (formData.email && !EMAIL_REGEX.test(formData.email)) {
            setEmailError("Adresse email invalide");
        } else {
            setEmailError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!EMAIL_REGEX.test(formData.email)) {
            setEmailError("Adresse email invalide");
            return;
        }

        setIsSubmitting(true);
        try {
            await register(formData);
            showToast("Inscription réussie, vous pouvez vous connecter", "success");
            navigate("/login");
        } catch (error) {
            // affiche le vrai message renvoyé par le backend (ex: email déjà utilisé)
            const backendMessage = error.response?.data?.message;
            setError(backendMessage || "Registration failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-7">
                    <div className="card shadow p-4">
                        <h2 className="text-center mb-4">
                            <UserPlus className="me-2" /> Register
                        </h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label"><UserPlus size={18} /> First Name</label>
                                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label"><User size={18} /> Last name</label>
                                <input type="text" className="form-control" name="lastname" value={formData.lastname} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label"><Mail size={18} /> Email</label>
                                <input
                                    type="email"
                                    className={`form-control${emailError ? " is-invalid" : ""}`}
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleEmailBlur}
                                    required
                                />
                                {emailError && <div className="invalid-feedback d-block">{emailError}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label"><Lock size={18} /> Password</label>
                                <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required minLength={6} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label"><FileText size={18} /> Bio</label>
                                <textarea rows={4} className="form-control" name="bio" value={formData.bio} onChange={handleChange} required />
                            </div>
                            <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Création du compte..." : "Register"}
                            </button>
                        </form>
                        <p className="text-center mt-3">
                            Already have an account ?
                            <Link to="/login" className="ms-2">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;

