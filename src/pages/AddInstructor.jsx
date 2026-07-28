import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createInstructorByAdmin } from "../services/instructorService";
import { sendVerificationEmail } from "../utils/emailjs";
import { useToast } from "../context/ToastContext";
import { UserPlus, Mail, Lock, FileText, User, ShieldCheck, ImagePlus, KeyRound } from "lucide-react";

function AddInstructor() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [step, setStep] = useState("form"); // "form" | "verify"
    const [formData, setFormData] = useState({
        name: "", lastname: "", email: "", password: "", bio: "", role: "instructor"
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [code, setCode] = useState("");
    const [codeInput, setCodeInput] = useState("");
    const [error, setError] = useState("");
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Étape 1 : générer un code et l'envoyer par email au futur instructeur
    const handleSendCode = async (e) => {
        e.preventDefault();
        setError("");
        setIsSendingCode(true);
        try {
            const generated = Math.floor(100000 + Math.random() * 900000).toString();
            await sendVerificationEmail({
                email: formData.email,
                code: generated,
            });
            setCode(generated);
            setStep("verify");
            showToast("Code de vérification envoyé par email", "success");
        } catch (err) {
            setError("Impossible d'envoyer l'email de vérification");
        } finally {
            setIsSendingCode(false);
        }
    };

    const handleResendCode = async () => {
        setIsSendingCode(true);
        try {
            const generated = Math.floor(100000 + Math.random() * 900000).toString();
            await sendVerificationEmail({
                email: formData.email,
                code: generated,
            });
            setCode(generated);
            showToast("Nouveau code envoyé", "success");
        } catch (err) {
            showToast("Impossible de renvoyer le code", "error");
        } finally {
            setIsSendingCode(false);
        }
    };

    // Étape 2 : vérifier le code, puis créer réellement le compte
    const handleConfirm = async (e) => {
        e.preventDefault();
        setError("");
        if (codeInput !== code) {
            setError("Code incorrect");
            return;
        }
        setIsSubmitting(true);
        try {
            const payload = new FormData();
            Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
            if (imageFile) payload.append("image", imageFile);

            await createInstructorByAdmin(payload);
            showToast("Compte créé avec succès", "success");
            navigate("/instructors");
        } catch (err) {
            setError(err.response?.data?.message || "Impossible de créer ce compte");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-7">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="mb-4">
                                <UserPlus className="me-2" /> Ajouter un instructeur
                            </h2>
                            {error && <div className="alert alert-danger">{error}</div>}

                            {step === "form" && (
                                <form onSubmit={handleSendCode}>
                                    <div className="text-center mb-3">
                                        <label htmlFor="image-upload" style={{ cursor: "pointer" }}>
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Aperçu" className="rounded-circle" width={100} height={100} style={{ objectFit: "cover" }} />
                                            ) : (
                                                <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto" style={{ width: 100, height: 100 }}>
                                                    <ImagePlus size={28} className="text-muted" />
                                                </div>
                                            )}
                                        </label>
                                        <input id="image-upload" type="file" accept="image/*" className="d-none" onChange={handleImageChange} />
                                        <div><small className="text-muted">Cliquez pour ajouter une photo</small></div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label"><User size={18} /> Prénom</label>
                                        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label"><User size={18} /> Nom</label>
                                        <input type="text" className="form-control" name="lastname" value={formData.lastname} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label"><Mail size={18} /> Email</label>
                                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label"><Lock size={18} /> Mot de passe</label>
                                        <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required minLength={6} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label"><FileText size={18} /> Bio</label>
                                        <textarea rows={3} className="form-control" name="bio" value={formData.bio} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label"><ShieldCheck size={18} /> Rôle</label>
                                        <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                                            <option value="instructor">Instructeur</option>
                                            <option value="admin">Administrateur</option>
                                        </select>
                                    </div>
                                    <button className="btn btn-primary w-100" type="submit" disabled={isSendingCode}>
                                        {isSendingCode ? "Envoi du code..." : "Envoyer le code de vérification"}
                                    </button>
                                </form>
                            )}

                            {step === "verify" && (
                                <form onSubmit={handleConfirm}>
                                    <div className="alert alert-info">
                                        Un code de vérification a été envoyé à <strong>{formData.email}</strong>.
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label"><KeyRound size={18} /> Code de vérification</label>
                                        <input type="text" className="form-control" value={codeInput} onChange={(e) => setCodeInput(e.target.value)} maxLength={6} required />
                                    </div>
                                    <button className="btn btn-primary w-100 mb-2" type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Création..." : "Confirmer et créer le compte"}
                                    </button>
                                    <button type="button" className="btn btn-link w-100" onClick={handleResendCode} disabled={isSendingCode}>
                                        Renvoyer le code
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddInstructor;