// Bannière réutilisable pour le haut des pages (Courses, Instructors, Contact...)
// Remplace `imageUrl` par une vraie photo (Unsplash/Pexels) une fois choisie.
// Sans image fournie, un dégradé de secours s'affiche (aucune dépendance externe).
function PageBanner({ title, subtitle, imageUrl }) {
    return (
        <div
            className="page-banner text-white text-center"
            style={imageUrl ? { backgroundImage: `linear-gradient(rgba(29,43,79,0.75), rgba(29,43,79,0.85)), url(${imageUrl})` } : {}}
        >
            <div className="container">
                <h1 className="fw-bold">{title}</h1>
                {subtitle && <p className="lead mb-0">{subtitle}</p>}
            </div>
        </div>
    );
}

export default PageBanner;
