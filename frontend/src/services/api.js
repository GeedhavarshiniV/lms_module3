import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Course APIs
export const courseAPI = {
  getAllCourses: (params) => api.get('/courses', { params }),
  getCourseById: (id) => api.get(`/courses/${id}`),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  toggleCourseStatus: (id, status) => api.patch(`/courses/${id}/publish`, { status }),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
};

// Module APIs
export const moduleAPI = {
  createModule: (courseId, moduleData) => api.post(`/courses/${courseId}/modules`, moduleData),
  updateModule: (id, moduleData) => api.put(`/courses/modules/${id}`, moduleData),
  deleteModule: (id) => api.delete(`/courses/modules/${id}`),
};

// Lesson APIs
export const lessonAPI = {
  createLesson: (moduleId, lessonData) => api.post(`/courses/modules/${moduleId}/lessons`, lessonData),
  getLessonById: (id) => api.get(`/courses/lessons/${id}`),
  updateLesson: (id, lessonData) => api.put(`/courses/lessons/${id}`, lessonData),
  deleteLesson: (id) => api.delete(`/courses/lessons/${id}`),
};

export default api;