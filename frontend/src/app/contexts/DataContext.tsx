import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import type { 
  User, 
  Center, 
  Session, 
  Class, 
  Subject, 
  FeeStructure, 
  Student, 
  Marks, 
  Payment, 
  Timetable, 
  Result,
  Certificate
} from '../types';
import {
  authApi,
  centerApi,
  studentApi,
  markApi,
  paymentApi,
  sessionApi,
  classApi,
  subjectApi,
  feeStructureApi,
  timetableApi,
  resultApi,
  certificateApi,
} from '../services/api';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  role: Extract<User['role'], 'center' | 'student'>;
  centerId?: string;
}

interface DataContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshData: () => Promise<void>;
  
  // Centers
  centers: Center[];
  addCenter: (center: Omit<Center, 'id' | 'createdAt'>) => Promise<Center>;
  updateCenter: (id: string, updates: Partial<Center>) => Promise<Center>;
  updateCenterStatus: (id: string, status: string) => Promise<Center>;
  
  // Sessions
  sessions: Session[];
  addSession: (session: Omit<Session, 'id'>) => Promise<Session>;
  
  // Classes
  classes: Class[];
  addClass: (cls: Omit<Class, 'id'>) => Promise<Class>;
  
  // Subjects
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id'>) => Promise<Subject>;
  
  // Fee Structures
  feeStructures: FeeStructure[];
  addFeeStructure: (fee: Omit<FeeStructure, 'id'>) => Promise<FeeStructure>;
  
  // Students
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'registrationDate'>) => Promise<Student>;
  updateStudent: (id: string, updates: Partial<Student>) => Promise<Student>;
  
  // Marks
  marks: Marks[];
  addMarks: (mark: Omit<Marks, 'id' | 'enteredAt'>) => Promise<Marks>;
  bulkAddMarks: (marksList: Omit<Marks, 'id' | 'enteredAt'>[]) => Promise<Marks[]>;
  
  // Payments
  payments: Payment[];
  addPayment: (payment: Omit<Payment, 'id'>) => Promise<Payment>;
  updatePayment: (id: string, updates: Partial<Payment>) => Promise<Payment>;
  
  // Timetables
  timetables: Timetable[];
  addTimetable: (timetable: Omit<Timetable, 'id' | 'uploadedAt'>) => Promise<Timetable>;
  
  // Results
  results: Result[];
  publishResult: (sessionId: string, classId: string) => Promise<Result>;
  
  // Certificates
  certificates: Certificate[];
  addCertificate: (cert: Omit<Certificate, 'id'>) => Promise<Certificate>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for all data
  const [centers, setCenters] = useState<Center[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Marks[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // Initialize - check auth status and load data
  useEffect(() => {
    const initialize = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('currentUser');

        if (savedToken && savedUser) {
          try {
            const response = await authApi.me();
            const payload = response.data?.data ?? response.data;
            setCurrentUser(payload?.user ?? payload);
            await loadAllData({ suppressLogout: true });
          } catch (err) {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            console.error('Token validation failed:', err);
          }
        }
      } catch (err) {
        setError('Failed to initialize application');
        console.error('Initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const loadAllData = async (options: { suppressLogout?: boolean } = {}) => {
    try {
      const [
        centersRes,
        sessionsRes,
        classesRes,
        subjectsRes,
        feeStructuresRes,
        studentsRes,
        marksRes,
        paymentsRes,
        timetablesRes,
        resultsRes,
        certificatesRes
      ] = await Promise.all([
        centerApi.getAll(),
        sessionApi.getAll(),
        classApi.getAll(),
        subjectApi.getAll(),
        feeStructureApi.getAll(),
        studentApi.getAll(),
        markApi.getAll(),
        paymentApi.getAll(),
        timetableApi.getAll(),
        resultApi.getAll(),
        certificateApi.getAll()
      ]);

      setCenters(centersRes.data);
      setSessions(sessionsRes.data);
      setClasses(classesRes.data);
      setSubjects(subjectsRes.data);
      setFeeStructures(feeStructuresRes.data);
      setStudents(studentsRes.data);
      setMarks(marksRes.data);
      setPayments(paymentsRes.data);
      setTimetables(timetablesRes.data);
      setResults(resultsRes.data);
      setCertificates(certificatesRes.data);
      setError(null);

    } catch (err: any) {
      console.error('Failed to load data:', err);
      if (err?.response?.status === 401 && !options.suppressLogout) {
        setError('Your session has expired. Please log in again.');
        await logout();
      } else if (!options.suppressLogout) {
        setError('Failed to load data from server');
      }
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await authApi.login(email, password);
      const payload = response.data?.data ?? response.data;
      const accessToken = payload?.access_token ?? payload?.token;
      const user = payload?.user ?? payload;

      if (!accessToken || !user) {
        throw new Error('Malformed login response');
      }

      localStorage.setItem('token', accessToken);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);

      await loadAllData();

      return true;
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please check your credentials.');
      return false;
    }
  };

  const register = async (payload: RegisterPayload): Promise<boolean> => {
    try {
      setError(null);
      await authApi.register({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        password_confirmation: payload.passwordConfirmation,
        role: payload.role,
        center_id: payload.centerId,
      });

      return await login(payload.email, payload.password);
    } catch (err) {
      console.error('Registration failed:', err);
      setError('Registration failed. Please try again.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
      setCenters([]);
      setSessions([]);
      setClasses([]);
      setSubjects([]);
      setFeeStructures([]);
      setStudents([]);
      setMarks([]);
      setPayments([]);
      setTimetables([]);
      setResults([]);
      setCertificates([]);
      setError(null);
    }
  };

  // Center operations
  const addCenter = async (center: Omit<Center, 'id' | 'createdAt'>) => {
    try {
      const response = await centerApi.create(center);
      setCenters([...centers, response.data]);
      return response.data;
    } catch (err) {
      console.error('Failed to add center:', err);
      throw err;
    }
  };

  const updateCenter = async (id: string, updates: Partial<Center>) => {
    try {
      const response = await centerApi.update(id, updates);
      setCenters(centers.map(c => c.id === id ? response.data : c));
      return response.data;
    } catch (err) {
      console.error('Failed to update center:', err);
      throw err;
    }
  };

  const updateCenterStatus = async (id: string, status: string) => {
    try {
      const response = await centerApi.updateStatus(id, status);
      setCenters(centers.map(c => c.id === id ? response.data : c));
      return response.data;
    } catch (err) {
      console.error('Failed to update center status:', err);
      throw err;
    }
  };

  // Session operations
  const addSession = async (session: Omit<Session, 'id'>) => {
    try {
      const response = await sessionApi.create(session);
      setSessions([...sessions, response.data]);
      return response.data;
    } catch (err) {
      console.error('Failed to add session:', err);
      throw err;
    }
  };

  // Class operations
  const addClass = async (cls: Omit<Class, 'id'>) => {
    try {
      const response = await classApi.create(cls);
      setClasses([...classes, response.data]);
      return response.data;
    } catch (err) {
      console.error('Failed to add class:', err);
      throw err;
    }
  };

  // Subject operations
  const addSubject = async (subject: Omit<Subject, 'id'>) => {
    try {
      const response = await subjectApi.create(subject);
      setSubjects([...subjects, response.data]);
      return response.data;
    } catch (err) {
      console.error('Failed to add subject:', err);
      throw err;
    }
  };

  // Fee Structure operations
  const addFeeStructure = async (fee: Omit<FeeStructure, 'id'>) => {
    try {
      const response = await feeStructureApi.create(fee);
      setFeeStructures([...feeStructures, response.data]);
      return response.data;
    } catch (err) {
      console.error('Failed to add fee structure:', err);
      throw err;
    }
  };

  // Student operations
  const addStudent = async (student: Omit<Student, 'id' | 'registrationDate'>) => {
    try {
      const response = await studentApi.create(student);
      setStudents([...students, response.data]);
      return response.data;
    } catch (err) {
      console.error('Failed to add student:', err);
      throw err;
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      const response = await studentApi.update(id, updates);
      setStudents(students.map(s => s.id === id ? response.data : s));
      return response.data;
    } catch (err) {
      console.error('Failed to update student:', err);
      throw err;
    }
  };

  // Marks operations
  const addMarks = async (mark: Omit<Marks, 'id' | 'enteredAt'>) => {
    try {
      const response = await markApi.create(mark);
      setMarks([...marks, response.data]);
      return response.data;
    } catch (err) {
      console.error('Failed to add marks:', err);
      throw err;
    }
  };

  const bulkAddMarks = async (marksList: Omit<Marks, 'id' | 'enteredAt'>[]) => {
    try {
      const response = await markApi.bulkCreate(marksList);
      setMarks([...marks, ...response.data]);
      return response.data;
    } catch (err) {
      console.error('Failed to bulk add marks:', err);
      throw err;
    }
  };

  // Payment operations
  const addPayment = async (payment: Omit<Payment, 'id'>) => {
    try {
      const response = await paymentApi.create(payment);
      setPayments([...payments, response.data]);
      return response.data;
    } catch (err) {
      console.error('Failed to add payment:', err);
      throw err;
    }
  };

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    try {
      const response = await paymentApi.update(id, updates);
      setPayments(payments.map(p => p.id === id ? response.data : p));
      return response.data;
    } catch (err) {
      console.error('Failed to update payment:', err);
      throw err;
    }
  };

  // Timetable operations
  const addTimetable = async (timetable: Omit<Timetable, 'id' | 'uploadedAt'>) => {
    try {
      const response = await timetableApi.create(timetable);
      setTimetables([...timetables, response.data]);
      return response.data;
    } catch (err) {
      console.error('Failed to add timetable:', err);
      throw err;
    }
  };

  // Result operations
  const publishResult = async (sessionId: string, classId: string) => {
    try {
      const response = await resultApi.publish(sessionId, classId);
      setResults(results.map(r => 
        r.sessionId === sessionId && r.classId === classId 
          ? { ...r, ...response.data } 
          : r
      ));
      return response.data;
    } catch (err) {
      console.error('Failed to publish result:', err);
      throw err;
    }
  };

  // Certificate operations
  const addCertificate = async (cert: Omit<Certificate, 'id'>) => {
    try {
      const response = await certificateApi.create(cert);
      setCertificates([...certificates, response.data]);
      return response.data;
    } catch (err) {
      console.error('Failed to add certificate:', err);
      throw err;
    }
  };

  // Refresh data
  const refreshData = async () => {
    setLoading(true);
    try {
      await loadAllData();
    } catch (err) {
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider value={{
      currentUser,
      loading,
      error,
      login,
      register,
      logout,
      refreshData,
      centers,
      addCenter,
      updateCenter,
      updateCenterStatus,
      sessions,
      addSession,
      classes,
      addClass,
      subjects,
      addSubject,
      feeStructures,
      addFeeStructure,
      students,
      addStudent,
      updateStudent,
      marks,
      addMarks,
      bulkAddMarks,
      payments,
      addPayment,
      updatePayment,
      timetables,
      addTimetable,
      results,
      publishResult,
      certificates,
      addCertificate
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}