import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'sonner';

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const JWT_TOKEN_KEY = 'openboard_jwt_token';
const REFRESH_TOKEN_KEY = 'openboard_refresh_token';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem(JWT_TOKEN_KEY);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken
          });
          
          localStorage.setItem(JWT_TOKEN_KEY, response.data.access_token);
          localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh_token);
          
          // Retry original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, logout user
        localStorage.removeItem(JWT_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'An unexpected error occurred';
    
    toast.error(errorMessage);
    
    return Promise.reject(error);
  }
);

// Auth Service
class AuthService {
  static async login(email: string, password: string): Promise<any> {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      localStorage.setItem(JWT_TOKEN_KEY, response.access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem(JWT_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
  }

  static async getCurrentUser(): Promise<any> {
    try {
      const response = await api.get('/auth/me');
      return response;
    } catch (error) {
      return null;
    }
  }

  static async refreshToken(): Promise<any> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) return null;
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refresh_token: refreshToken
      });
      
      localStorage.setItem(JWT_TOKEN_KEY, response.data.access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh_token);
      
      return response.data;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem(JWT_TOKEN_KEY);
  }
}

// Center Service
class CenterService {
  static async getAll(): Promise<any> {
    return api.get('/centers');
  }

  static async getById(id: string): Promise<any> {
    return api.get(`/centers/${id}`);
  }

  static async create(data: any): Promise<any> {
    return api.post('/centers', data);
  }

  static async update(id: string, data: any): Promise<any> {
    return api.put(`/centers/${id}`, data);
  }

  static async updateStatus(id: string, status: string): Promise<any> {
    return api.put(`/centers/${id}/status`, { status });
  }

  static async delete(id: string): Promise<any> {
    return api.delete(`/centers/${id}`);
  }
}

// Student Service
class StudentService {
  static async getAll(): Promise<any> {
    return api.get('/students');
  }

  static async getById(id: string): Promise<any> {
    return api.get(`/students/${id}`);
  }

  static async getProfile(id: string): Promise<any> {
    return api.get(`/students/${id}/profile`);
  }

  static async create(data: any): Promise<any> {
    return api.post('/students', data);
  }

  static async update(id: string, data: any): Promise<any> {
    return api.put(`/students/${id}`, data);
  }

  static async delete(id: string): Promise<any> {
    return api.delete(`/students/${id}`);
  }
}

// Marks Service
class MarksService {
  static async getAll(): Promise<any> {
    return api.get('/marks');
  }

  static async getByStudent(studentId: string): Promise<any> {
    return api.get(`/marks/student/${studentId}`);
  }

  static async create(data: any): Promise<any> {
    return api.post('/marks', data);
  }

  static async bulkCreate(data: any[]): Promise<any> {
    return api.post('/marks/bulk', data);
  }
}

// Payment Service
class PaymentService {
  static async getAll(): Promise<any> {
    return api.get('/payments');
  }

  static async getByStudent(studentId: string): Promise<any> {
    return api.get(`/payments/student/${studentId}`);
  }

  static async create(data: any): Promise<any> {
    return api.post('/payments', data);
  }

  static async update(id: string, data: any): Promise<any> {
    return api.put(`/payments/${id}`, data);
  }
}

// Session Service
class SessionService {
  static async getAll(): Promise<any> {
    return api.get('/sessions');
  }

  static async getById(id: string): Promise<any> {
    return api.get(`/sessions/${id}`);
  }

  static async create(data: any): Promise<any> {
    return api.post('/sessions', data);
  }

  static async update(id: string, data: any): Promise<any> {
    return api.put(`/sessions/${id}`, data);
  }

  static async delete(id: string): Promise<any> {
    return api.delete(`/sessions/${id}`);
  }
}

// Class Service
class ClassService {
  static async getAll(): Promise<any> {
    return api.get('/classes');
  }

  static async getById(id: string): Promise<any> {
    return api.get(`/classes/${id}`);
  }

  static async create(data: any): Promise<any> {
    return api.post('/classes', data);
  }

  static async update(id: string, data: any): Promise<any> {
    return api.put(`/classes/${id}`, data);
  }

  static async delete(id: string): Promise<any> {
    return api.delete(`/classes/${id}`);
  }
}

// Subject Service
class SubjectService {
  static async getAll(): Promise<any> {
    return api.get('/subjects');
  }

  static async getById(id: string): Promise<any> {
    return api.get(`/subjects/${id}`);
  }

  static async create(data: any): Promise<any> {
    return api.post('/subjects', data);
  }

  static async update(id: string, data: any): Promise<any> {
    return api.put(`/subjects/${id}`, data);
  }

  static async delete(id: string): Promise<any> {
    return api.delete(`/subjects/${id}`);
  }
}

// Fee Structure Service
class FeeStructureService {
  static async getAll(): Promise<any> {
    return api.get('/fee-structures');
  }

  static async getById(id: string): Promise<any> {
    return api.get(`/fee-structures/${id}`);
  }

  static async create(data: any): Promise<any> {
    return api.post('/fee-structures', data);
  }

  static async update(id: string, data: any): Promise<any> {
    return api.put(`/fee-structures/${id}`, data);
  }

  static async delete(id: string): Promise<any> {
    return api.delete(`/fee-structures/${id}`);
  }
}

// Timetable Service
class TimetableService {
  static async getAll(): Promise<any> {
    return api.get('/timetables');
  }

  static async getById(id: string): Promise<any> {
    return api.get(`/timetables/${id}`);
  }

  static async upload(data: FormData): Promise<any> {
    return api.post('/timetables', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  static async download(id: string): Promise<any> {
    return api.get(`/timetables/download/${id}`, {
      responseType: 'blob'
    });
  }

  static async delete(id: string): Promise<any> {
    return api.delete(`/timetables/${id}`);
  }
}

// Result Service
class ResultService {
  static async getAll(): Promise<any> {
    return api.get('/results');
  }

  static async getStatus(sessionId: string, classId: string): Promise<any> {
    return api.get(`/results/${sessionId}/${classId}`);
  }

  static async getStudentResults(studentId: string): Promise<any> {
    return api.get(`/results/student/${studentId}`);
  }

  static async publish(data: any): Promise<any> {
    return api.post('/results/publish', data);
  }
}

// Certificate Service
class CertificateService {
  static async getAll(): Promise<any> {
    return api.get('/certificates');
  }

  static async getById(id: string): Promise<any> {
    return api.get(`/certificates/${id}`);
  }

  static async generate(data: any): Promise<any> {
    return api.post('/certificates', data);
  }

  static async download(id: string): Promise<any> {
    return api.get(`/certificates/download/${id}`, {
      responseType: 'blob'
    });
  }

  static async delete(id: string): Promise<any> {
    return api.delete(`/certificates/${id}`);
  }
}

export {
  api,
  AuthService,
  CenterService,
  StudentService,
  MarksService,
  PaymentService,
  SessionService,
  ClassService,
  SubjectService,
  FeeStructureService,
  TimetableService,
  ResultService,
  CertificateService,
};