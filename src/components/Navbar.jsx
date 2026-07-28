import { BookOpen, User, LogIn, LogOut, LayoutDashboard, Settings, Mail, UserPlus } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function NavBar() {
    const { isAuthenticated, isAdmin, currentInstructorId, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const instructorsPath = isAdmin ? "/instructors" : `/instructors/${currentInstructorId}`;

    const handleLogout = () => {
        logout();
        showToast("Vous êtes déconnecté", "info");
        navigate("/login");
    };

    const linkClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

    return (
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark sticky-top'>
            <div className='container'>
                <Link className='navbar-brand text-white d-flex align-items-center' to="/">
                    <span className="brand-stamp">
                        <BookOpen size={16} />
                    </span>
                    E-learning
                </Link>

                <button className='navbar-toggler' data-bs-toggle="collapse" data-bs-target="#menu">
                    <span className='navbar-toggler-icon'></span>
                </button>

                <div className='collapse navbar-collapse' id="menu">
                    <ul className='navbar-nav ms-auto align-items-lg-center'>
                        <li className='nav-item'>
                            <NavLink className={linkClass} to="/courses">
                                <BookOpen size={18} className="me-1" /> Cours
                            </NavLink>
                        </li>

                        {isAuthenticated && (
                            <li className='nav-item'>
                                <NavLink className={linkClass} to={instructorsPath}>
                                    <User size={18} className="me-1" /> Instructeurs
                                </NavLink>
                            </li>
                        )}



                        {isAdmin && (
                            <>
                                <li className='nav-item'>
                                    <NavLink className={linkClass} to="/dashbord">
                                        <LayoutDashboard size={18} className="me-1" /> Tableau de bord
                                    </NavLink>
                                </li>
                                <li className='nav-item'>
                                    <NavLink className={linkClass} to="/manage-courses">
                                        <Settings size={18} className="me-1" /> Gérer
                                    </NavLink>
                                </li>
                            </>
                        )}
                                                <li className='nav-item'>
                            <NavLink className={linkClass} to="/contact">
                                <Mail size={18} className="me-1" /> Contact
                            </NavLink>
                        </li>

                        {isAuthenticated ? (
                            <li className='nav-item'>
                                <button className="btn btn-sm btn-outline-light ms-lg-3 my-2 my-lg-0" onClick={handleLogout}>
                                    <LogOut size={16} className="me-1" /> Déconnexion
                                </button>
                            </li>
                        ) : (
                            <li className='nav-item'>
                                <NavLink className={linkClass} to="/login">
                                    <LogIn size={18} className="me-1" /> Connexion
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;

