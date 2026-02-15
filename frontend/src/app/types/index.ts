// Type definitions for the education management system

export type UserRole = 'admin' | 'center' | 'student';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  centerId?: string; // For center staff and students
}

export interface Center {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
}

export interface Session {
  id: string;
  name: string; // e.g., "2026-27"
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Class {
  id: string;
  name: string; // e.g., "Class 10", "Class 12"
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classId: string;
  maxMarks: number;
}

export interface FeeStructure {
  id: string;
  sessionId: string;
  classId: string;
  amount: number;
  description: string;
}

export interface Student {
  id: string;
  centerId: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  rollNumber: string;
  sessionId: string;
  fatherName: string;
  motherName: string;
  dob: string;
  address: string;
  photo?: string;
  documents: string[];
  registrationDate: string;
}

export interface Marks {
  id: string;
  studentId: string;
  subjectId: string;
  sessionId: string;
  marks: number;
  maxMarks: number;
  enteredBy: string;
  enteredAt: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentDate?: string;
  transactionId?: string;
  sessionId: string;
}

export interface Timetable {
  id: string;
  sessionId: string;
  classId: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface Result {
  id: string;
  sessionId: string;
  classId: string;
  isPublished: boolean;
  publishedAt?: string;
}

export interface AdmitCard {
  studentId: string;
  sessionId: string;
  examCenter: string;
  examDate: string;
}

export interface Certificate {
  id: string;
  studentId: string;
  type: 'completion' | 'achievement' | 'participation';
  issuedDate: string;
  certificateNumber: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Attendance {
  id: string;
  studentId: string;
  sessionId: string;
  classId: string;
  centerId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
  student?: Student;
  session?: Session;
  class?: Class;
  center?: Center;
  recorder?: User;
}

export interface AttendanceSummary {
  status: AttendanceStatus;
  count: number;
}

export interface StudentAttendanceSummary {
  summary: AttendanceSummary[];
  total: number;
  studentId: string;
}

export interface ClassAttendanceSummary {
  date: string;
  status: AttendanceStatus;
  count: number;
}
