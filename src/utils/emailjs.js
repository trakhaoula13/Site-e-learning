import emailjs from '@emailjs/browser';

// Service + clé publics par défaut (réinitialisation de mot de passe + vérification)
const SERVICE_ID =
    import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PUBLIC_KEY =
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Le formulaire Contact peut être rattaché à un service EmailJS différent
// (laisse vide dans le .env pour utiliser le même service que ci-dessus)
const SERVICE_CONTACT =
    import.meta.env.VITE_EMAILJS_SERVICE_CONTACT_ID || SERVICE_ID;
const PUBLIC_KEY_CONTACT =
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY_CONTACT || PUBLIC_KEY;

const TEMPLATE_PASSWORD_RESET =
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID; // "Reset your password" : {{email}}, {{link}}
const TEMPLATE_CONTACT =
    import.meta.env.VITE_EMAILJS_TEMPLATE_CONTACT_ID;
const TEMPLATE_VERIFICATION =
    import.meta.env.VITE_EMAILJS_TEMPLATE_VERIFICATION_ID; // "One-Time Password" : {{email}}, {{passcode}}, {{time}}

function send(serviceId, templateId, templateParams, publicKey) {
    return emailjs.send(serviceId, templateId, templateParams, publicKey);
}

// Réinitialisation de mot de passe
export function sendPasswordResetEmail({ email, link }) {
    return send(SERVICE_ID, TEMPLATE_PASSWORD_RESET, { email, link }, PUBLIC_KEY);
}

// Code de vérification lors de la création d'un compte instructeur
export function sendVerificationEmail({ email, code }) {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const time = expiresAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    return send(SERVICE_ID, TEMPLATE_VERIFICATION, { email, passcode: code, time }, PUBLIC_KEY);
}

// Formulaire de contact (peut utiliser un service/template EmailJS différent)
export function sendContactEmail({ from_name, from_email, subject, message }) {
    return send(SERVICE_CONTACT, TEMPLATE_CONTACT, { from_name, from_email, subject, message }, PUBLIC_KEY_CONTACT);
}