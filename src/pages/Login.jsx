import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/instructorService";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Mail, Lock, LogIn } from "lucide-react";
import { useContext, useState } from "react";

function Login() {
    const navigate = useNavigate();
    const { login: authLogin } = useContext(AuthContext);
    const { showToast } = useToast();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            const reponse = await login(formData);
            authLogin(reponse.data.token);
            showToast("Connexion réussie", "success");
            navigate("/dashbord");
        } catch (error) {
            setError(error.response?.data?.message || "Email ou mot de passe incorrect");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow p-4">
                        <h2 className="text-center mb-4">
                            <LogIn /> Connexion
                        </h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label"><Mail size={18} /> Email</label>
                                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label"><Lock size={18} /> Mot de passe</label>
                                <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
                            </div>
                            <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Connexion..." : "Se connecter"}
                            </button>
                        </form>
                        <p className="text-center mt-3">
                            <Link to="/forgot-password">Mot de passe oublié ?</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;