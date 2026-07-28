import api from "./api"


//recuperertous les cours

export const getCourses = () => {
    return api.get("/courses/all");
};
//recuperarion by id 


export const getCourse = (id) => {
    return api.get(`/courses/${id}`);
};

//ajout Cours

export const addCourse = (course) => {
    return api.post("/courses/add", course);

};

//modifier

export const updateCourse = (id, course) => {
    return api.put(`/courses/${id}`, course);
};

//suppression

export const deleteCours = (id) => {
    return api.delete(`/courses/${id}`);
};

//recuperations de tousles cours d'un instructeur 

export const getCourseByInstructor = (id) => {
    return api.get(`/courses/instructor/${id}`);
};