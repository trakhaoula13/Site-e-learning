import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from "./components/Navbar";
import Footer from "./components/Footer.jsx";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Courses from "./pages/Courses.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Instructors from "./pages/Instructor.jsx";
import InstructorDetails from "./pages/InstructorDetails.jsx";
import AddCourse from "./pages/AddCourse.jsx";
import EditCourse from "./pages/EditCourse.jsx";
import ManageCourses from "./pages/ManageCourses.jsx";
import AddInstructor from "./pages/AddInstructor.jsx";
import Dashboard from "./pages/Dashbord.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";
import Register from "./pages/Register.jsx";
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            {/* Public : consultants / visiteurs */}
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />

            {/* Connecté (instructeur ou admin) : lecture seule sur les instructeurs */}
            <Route path="/instructors" element={
              <PrivateRoute>
                <Instructors />
              </PrivateRoute>
            } />
            <Route path="/instructors/:id" element={
              <PrivateRoute>
                <InstructorDetails />
              </PrivateRoute>
            } />

            {/* Admin uniquement */}
            <Route path="/dashbord" element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } />
            <Route path="/manage-courses" element={
              <AdminRoute>
                <ManageCourses />
              </AdminRoute>
            } />
            <Route path="/add-course" element={
              <AdminRoute>
                <AddCourse />
              </AdminRoute>
            } />
            <Route path="/edit-course/:id" element={
              <PrivateRoute>
                <EditCourse />
              </PrivateRoute>
            } />
            <Route path="/add-instructor" element={
              <AdminRoute>
                <AddInstructor />
              </AdminRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

