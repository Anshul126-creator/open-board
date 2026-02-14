import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding token
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

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    center_id?: string;
  }) => api.post('/auth/register', data),
  logout: () => 
    api.post('/auth/logout'),
  me: () => 
    api.get('/auth/me'),
  refresh: () => 
    api.post('/auth/refresh'),
};

export const centerApi = {
  getAll: () => api.get('/centers'),
  getById: (id: string) => api.get(`/centers/${id}`),
  create: (data: any) => api.post('/centers', data),
  update: (id: string, data: any) => api.put(`/centers/${id}`, data),
  updateStatus: (id: string, status: string) => 
    api.put(`/centers/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/centers/${id}`),
};

export const studentApi = {
  getAll: () => api.get('/students'),
  getById: (id: string) => api.get(`/students/${id}`),
  getProfile: (id: string) => api.get(`/students/${id}/profile`),
  create: (data: any) => api.post('/students', data),
  update: (id: string, data: any) => api.put(`/students/${id}`, data),
  delete: (id: string) => api.delete(`/students/${id}`),
};

export const markApi = {
  getAll: () => api.get('/marks'),
  getByStudent: (studentId: string) => api.get(`/marks/student/${studentId}`),
  getBySubject: (subjectId: string) => api.get(`/marks/subject/${subjectId}`),
  create: (data: any) => api.post('/marks', data),
  bulkCreate: (data: any[]) => api.post('/marks/bulk', data),
  update: (id: string, data: any) => api.put(`/marks/${id}`, data),
  delete: (id: string) => api.delete(`/marks/${id}`),
};

export const paymentApi = {
  getAll: () => api.get('/payments'),
  getByStudent: (studentId: string) => api.get(`/payments/student/${studentId}`),
  create: (data: any) => api.post('/payments', data),
  update: (id: string, data: any) => api.put(`/payments/${id}`, data),
  delete: (id: string) => api.delete(`/payments/${id}`),
};

export const sessionApi = {
  getAll: () => api.get('/sessions'),
  getById: (id: string) => api.get(`/sessions/${id}`),
  create: (data: any) => api.post('/sessions', data),
  update: (id: string, data: any) => api.put(`/sessions/${id}`, data),
  delete: (id: string) => api.delete(`/sessions/${id}`),
};

export const classApi = {
  getAll: () => api.get('/classes'),
  getById: (id: string) => api.get(`/classes/${id}`),
  create: (data: any) => api.post('/classes', data),
  update: (id: string, data: any) => api.put(`/classes/${id}`, data),
  delete: (id: string) => api.delete(`/classes/${id}`),
};

export const subjectApi = {
  getAll: () => api.get('/subjects'),
  getById: (id: string) => api.get(`/subjects/${id}`),
  create: (data: any) => api.post('/subjects', data),
  update: (id: string, data: any) => api.put(`/subjects/${id}`, data),
  delete: (id: string) => api.delete(`/subjects/${id}`),
};

export const feeStructureApi = {
  getAll: () => api.get('/fee-structures'),
  getById: (id: string) => api.get(`/fee-structures/${id}`),
  create: (data: any) => api.post('/fee-structures', data),
  update: (id: string, data: any) => api.put(`/fee-structures/${id}`, data),
  delete: (id: string) => api.delete(`/fee-structures/${id}`),
};

export const timetableApi = {
  getAll: () => api.get('/timetables'),
  getById: (id: string) => api.get(`/timetables/${id}`),
  create: (data: any) => api.post('/timetables', data),
  update: (id: string, data: any) => api.put(`/timetables/${id}`, data),
  delete: (id: string) => api.delete(`/timetables/${id}`),
  download: (id: string) => api.get(`/timetables/download/${id}`, { responseType: 'blob' }),
};

export const resultApi = {
  getAll: () => api.get('/results'),
  getById: (id: string) => api.get(`/results/${id}`),
  getStatus: (sessionId: string, classId: string) => api.get(`/results/${sessionId}/${classId}`),
  getStudentResults: (studentId: string) => api.get(`/results/student/${studentId}`),
  publish: (sessionId: string, classId: string) => 
    api.post('/results/publish', { sessionId, classId }),
  create: (data: any) => api.post('/results', data),
  update: (id: string, data: any) => api.put(`/results/${id}`, data),
  delete: (id: string) => api.delete(`/results/${id}`),
};

export const certificateApi = {
  getAll: () => api.get('/certificates'),
  getById: (id: string) => api.get(`/certificates/${id}`),
  create: (data: any) => api.post('/certificates', data),
  update: (id: string, data: any) => api.put(`/certificates/${id}`, data),
  delete: (id: string) => api.delete(`/certificates/${id}`),
  download: (id: string) => api.get(`/certificates/download/${id}`, { responseType: 'blob' }),
};

export const healthCheck = () => api.get('/health');

export const getFrontendConfig = () => api.get('/frontend/config');