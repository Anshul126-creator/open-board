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
  CertificateService
} from '../services/api';

interface DataContextType {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  
  // Centers
  centers: Center[];
  addCenter: (center: Omit<Center, 'id' | 'createdAt'>) => void;
  updateCenter: (id: string, updates: Partial<Center>) => void;
  
  // Sessions
  sessions: Session[];
  addSession: (session: Omit<Session, 'id'>) => void;
  
  // Classes
  classes: Class[];
  addClass: (cls: Omit<Class, 'id'>) => void;
  
  // Subjects
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  
  // Fee Structures
  feeStructures: FeeStructure[];
  addFeeStructure: (fee: Omit<FeeStructure, 'id'>) => void;
  
  // Students
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'registrationDate'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  
  // Marks
  marks: Marks[];
  addMarks: (mark: Omit<Marks, 'id' | 'enteredAt'>) => void;
  bulkAddMarks: (marksList: Omit<Marks, 'id' | 'enteredAt'>[]) => void;
  
  // Payments
  payments: Payment[];
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  
  // Timetables
  timetables: Timetable[];
  addTimetable: (timetable: Omit<Timetable, 'id' | 'uploadedAt'>) => void;
  
  // Results
  results: Result[];
  publishResult: (sessionId: string, classId: string) => void;
  
  // Certificates
  certificates: Certificate[];
  addCertificate: (cert: Omit<Certificate, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substring(2, 15);

// Initial mock data (fallback when API is not available)
const initialUsers: User[] = [
  {
    id: '1',
    email: 'admin@edu.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: '2',
    email: 'center1@edu.com',
    password: 'center123',
    role: 'center',
    name: 'Center Manager',
    centerId: 'center1'
  },
  {
    id: '3',
    email: 'student@edu.com',
    password: 'student123',
    role: 'student',
    name: 'John Doe',
    centerId: 'center1'
  }
];

const initialCenters: Center[] = [
  {
    id: 'center1',
    name: 'Delhi Central Institute',
    code: 'DCI001',
    address: 'New Delhi, India',
    phone: '+91-9876543210',
    email: 'center1@edu.com',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'center2',
    name: 'Mumbai Education Hub',
    code: 'MEH002',
    address: 'Mumbai, India',
    phone: '+91-9876543211',
    email: 'center2@edu.com',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

const initialSessions: Session[] = [
  {
    id: 'session1',
    name: '2026-27',
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    isActive: true
  }
];

const initialClasses: Class[] = [
  { id: 'class10', name: 'Class 10' },
  { id: 'class12', name: 'Class 12' }
];

const initialSubjects: Subject[] = [
  { id: 'sub1', name: 'Mathematics', code: 'MATH', classId: 'class10', maxMarks: 100 },
  { id: 'sub2', name: 'Science', code: 'SCI', classId: 'class10', maxMarks: 100 },
  { id: 'sub3', name: 'English', code: 'ENG', classId: 'class10', maxMarks: 100 },
  { id: 'sub4', name: 'Physics', code: 'PHY', classId: 'class12', maxMarks: 100 },
  { id: 'sub5', name: 'Chemistry', code: 'CHEM', classId: 'class12', maxMarks: 100 }
];

const initialStudents: Student[] = [
  {
    id: 'std1',
    centerId: 'center1',
    name: 'John Doe',
    email: 'student@edu.com',
    phone: '+91-9999999999',
    class: 'class10',
    rollNumber: 'DCI001001',
    sessionId: 'session1',
    fatherName: 'Robert Doe',
    motherName: 'Jane Doe',
    dob: '2010-05-15',
    address: 'New Delhi, India',
    documents: [],
    registrationDate: new Date().toISOString()
  }
];

const initialPayments: Payment[] = [
  {
    id: 'pay1',
    studentId: 'std1',
    amount: 5000,
    status: 'pending',
    sessionId: 'session1'
  }
];

const initialFeeStructures: FeeStructure[] = [
  {
    id: 'fee1',
    sessionId: 'session1',
    classId: 'class10',
    amount: 5000,
    description: 'Annual examination fee'
  },
  {
    id: 'fee2',
    sessionId: 'session1',
    classId: 'class12',
    amount: 6000,
    description: 'Annual examination fee'
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
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

  // Load data from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Check authentication
        const user = await AuthService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }

        // Load all data from API
        const [centersData, sessionsData, classesData, subjectsData, 
               feeStructuresData, studentsData, marksData, paymentsData, 
               timetablesData, resultsData, certificatesData] = await Promise.all([
          CenterService.getAll(),
          SessionService.getAll(),
          ClassService.getAll(),
          SubjectService.getAll(),
          FeeStructureService.getAll(),
          StudentService.getAll(),
          MarksService.getAll(),
          PaymentService.getAll(),
          TimetableService.getAll(),
          ResultService.getAll(),
          CertificateService.getAll(),
        ]);

        setCenters(centersData.data || []);
        setSessions(sessionsData.data || []);
        setClasses(classesData.data || []);
        setSubjects(subjectsData.data || []);
        setFeeStructures(feeStructuresData.data || []);
        setStudents(studentsData.data || []);
        setMarks(marksData.data || []);
        setPayments(paymentsData.data || []);
        setTimetables(timetablesData.data || []);
        setResults(resultsData.data || []);
        setCertificates(certificatesData.data || []);
      } catch (error) {
        console.error('Failed to load data:', error);
        // Fallback to initial data if API fails
        setCenters(initialCenters);
        setSessions(initialSessions);
        setClasses(initialClasses);
        setSubjects(initialSubjects);
        setFeeStructures(initialFeeStructures);
        setStudents(initialStudents);
        setPayments(initialPayments);
      }
    };

    loadData();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await AuthService.login(email, password);
      setCurrentUser(response.user);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } finally {
      setCurrentUser(null);
    }
  };

  const addCenter = async (center: Omit<Center, 'id' | 'createdAt'>) => {
    try {
      const response = await CenterService.create(center);
      setCenters([...centers, response.data]);
      return response.data;
    } catch (error) {
      console.error('Failed to add center:', error);
      throw error;
    }
  };

  const updateCenter = async (id: string, updates: Partial<Center>) => {
    try {
      const response = await CenterService.update(id, updates);
      setCenters(centers.map(c => c.id === id ? response.data : c));
      return response.data;
    } catch (error) {
      console.error('Failed to update center:', error);
      throw error;
    }
  };

  const addSession = (session: Omit<Session, 'id'>) => {
    const newSession: Session = { ...session, id: generateId() };
    setSessions([...sessions, newSession]);
  };

  const addClass = (cls: Omit<Class, 'id'>) => {
    const newClass: Class = { ...cls, id: generateId() };
    setClasses([...classes, newClass]);
  };

  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject: Subject = { ...subject, id: generateId() };
    setSubjects([...subjects, newSubject]);
  };

  const addFeeStructure = (fee: Omit<FeeStructure, 'id'>) => {
    const newFee: FeeStructure = { ...fee, id: generateId() };
    setFeeStructures([...feeStructures, newFee]);
  };

  const addStudent = async (student: Omit<Student, 'id' | 'registrationDate'>) => {
    try {
      const response = await StudentService.create(student);
      setStudents([...students, response.data]);
      return response.data;
    } catch (error) {
      console.error('Failed to add student:', error);
      throw error;
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      const response = await StudentService.update(id, updates);
      setStudents(students.map(s => s.id === id ? response.data : s));
      return response.data;
    } catch (error) {
      console.error('Failed to update student:', error);
      throw error;
    }
  };

  const addMarks = async (mark: Omit<Marks, 'id' | 'enteredAt'>) => {
    try {
      const response = await MarksService.create(mark);
      setMarks([...marks, response.data]);
      return response.data;
    } catch (error) {
      console.error('Failed to add marks:', error);
      throw error;
    }
  };

  const bulkAddMarks = async (marksList: Omit<Marks, 'id' | 'enteredAt'>[]) => {
    try {
      const response = await MarksService.bulkCreate(marksList);
      setMarks([...marks, ...response.data]);
      return response.data;
    } catch (error) {
      console.error('Failed to bulk add marks:', error);
      throw error;
    }
  };

  const addPayment = (payment: Omit<Payment, 'id'>) => {
    const newPayment: Payment = { ...payment, id: generateId() };
    setPayments([...payments, newPayment]);
  };

  const updatePayment = (id: string, updates: Partial<Payment>) => {
    setPayments(payments.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addTimetable = (timetable: Omit<Timetable, 'id' | 'uploadedAt'>) => {
    const newTimetable: Timetable = {
      ...timetable,
      id: generateId(),
      uploadedAt: new Date().toISOString()
    };
    setTimetables([...timetables, newTimetable]);
  };

  const publishResult = (sessionId: string, classId: string) => {
    const existing = results.find(r => r.sessionId === sessionId && r.classId === classId);
    if (existing) {
      setResults(results.map(r => 
        r.sessionId === sessionId && r.classId === classId 
          ? { ...r, isPublished: true, publishedAt: new Date().toISOString() }
          : r
      ));
    } else {
      const newResult: Result = {
        id: generateId(),
        sessionId,
        classId,
        isPublished: true,
        publishedAt: new Date().toISOString()
      };
      setResults([...results, newResult]);
    }
  };

  const addCertificate = (cert: Omit<Certificate, 'id'>) => {
    const newCert: Certificate = { ...cert, id: generateId() };
    setCertificates([...certificates, newCert]);
  };

  return (
    <DataContext.Provider value={{
      currentUser,
      login,
      logout,
      centers,
      addCenter,
      updateCenter,
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