import { useState } from "react";
import { Mail, Phone, MapPin, Send, User, MessageSquare, AtSign, Clock } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { sendContactEmail } from "../utils/emailjs";
import PageBanner from "../components/PageBanner";

function Contact() {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await sendContactEmail({
                from_name: formData.name,
                from_email: formData.email,
                subject: formData.subject,
                message: formData.message,
            });

            showToast("Votre message a été envoyé avec succès !", "success");
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error) {
            console.error("Erreur EmailJS :", error);
            showToast("Une erreur est survenue. Veuillez réessayer.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <PageBanner title="Contactez-nous" subtitle="Une question ? Nous sommes là pour vous aider" />

            <div className="container mt-5 mb-5">
                <div className="row g-4">
                    {/* Colonne coordonnées - design épuré avec icônes sans fond */}
                    <div className="col-md-5">
                        <div className="card shadow-sm border-0 h-100 p-4">
                            <h5 className="text-center mb-4">
                                <MapPin size={20} className="text-primary me-2" />
                                Nos coordonnées
                            </h5>
                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex align-items-center">
                                    <Mail size={18} className="text-primary me-3" />
                                    <div>
                                        <small className="text-muted d-block">Email</small>
                                        <strong>contact@e-learning.com</strong>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <Phone size={18} className="text-primary me-3" />
                                    <div>
                                        <small className="text-muted d-block">Téléphone</small>
                                        <strong>+216 54 668 606</strong>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <MapPin size={18} className="text-primary me-3" />
                                    <div>
                                        <small className="text-muted d-block">Adresse</small>
                                        <strong>Tunis, Tunisie</strong>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <Clock size={18} className="text-primary me-3" />
                                    <div>
                                        <small className="text-muted d-block">Horaires</small>
                                        <strong>Lun–Ven, 9h–18h</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Colonne formulaire */}
                    <div className="col-md-7">
                        <div className="card shadow-sm border-0 p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        <User size={16} className="me-1" /> Nom
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Votre nom"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        <AtSign size={16} className="me-1" /> Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="exemple@domaine.com"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        <MessageSquare size={16} className="me-1" /> Sujet
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="Objet de votre message"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Message</label>
                                    <textarea
                                        rows={5}
                                        className="form-control"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Écrivez votre message ici..."
                                        required
                                    />
                                </div>
                                <button
                                    className="btn btn-primary w-100 py-2 fw-semibold"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    <Send size={18} className="me-2" />
                                    {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Contact;