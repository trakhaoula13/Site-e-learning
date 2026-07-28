import api from "./api";

export const register = (user) => {
    return api.post("/instructors/register", user);
};

export const login = (user) => {
    return api.post("/instructors/login", user);
};

export const getInstructor = (id) => {
    return api.get(`/instructors/${id}`);
};

export const getInstructors = () => {
    return api.get("/instructors/all");
};

export const deleteInstructor = (id) => {
    return api.delete(`/instructors/${id}`);
};

// réservé à l'admin (route protégée côté backend) — accepte un FormData (avec image)
export const createInstructorByAdmin = (formData) => {
    return api.post("/instructors/admin-create", formData);
};

// modification du profil (admin sur n'importe qui, instructeur sur lui-même) — FormData
export const updateInstructor = (id, formData) => {
    return api.put(`/instructors/${id}`, formData);
};

export const forgotPassword = (email) => {
    return api.post("/instructors/forgot-password", { email });
};

export const resetPassword = (token, password) => {
    return api.post(`/instructors/reset-password/${token}`, { password });
};