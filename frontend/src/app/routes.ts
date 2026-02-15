import { createBrowserRouter, Navigate } from 'react-router';
import { Login } from './pages/Login';
import { AdminLayout } from './layouts/AdminLayout';
import { CenterLayout } from './layouts/CenterLayout';
import { StudentLayout } from './layouts/StudentLayout';

// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { CenterManagement } from './pages/admin/CenterManagement';
import { StudentsList } from './pages/admin/StudentsList';
import { SubjectSetup } from './pages/admin/SubjectSetup';
import { SessionSetup } from './pages/admin/SessionSetup';
import { FeeStructureSetup } from './pages/admin/FeeStructureSetup';
import { TimetableUpload } from './pages/admin/TimetableUpload';
import { ResultPublish } from './pages/admin/ResultPublish';

// Center Pages
import { CenterDashboard } from './pages/center/Dashboard';
import { StudentRegistration } from './pages/center/StudentRegistration';
import { MarksEntry } from './pages/center/MarksEntry';
import { PaymentTracking } from './pages/center/PaymentTracking';
import { AdmitCards } from './pages/center/AdmitCards';
import { AttendanceManagement } from './pages/center/AttendanceManagement';

// Student Pages
import { StudentProfile } from './pages/student/Profile';
import { FeePayment } from './pages/student/FeePayment';
import { StudentResults } from './pages/student/Results';

// Verification Page
import { VerifyPage } from './pages/Verify';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login
  },
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: 'centers', Component: CenterManagement },
      { path: 'students', Component: StudentsList },
      { path: 'subjects', Component: SubjectSetup },
      { path: 'sessions', Component: SessionSetup },
      { path: 'fees', Component: FeeStructureSetup },
      { path: 'timetables', Component: TimetableUpload },
      { path: 'results', Component: ResultPublish }
    ]
  },
  {
    path: '/center',
    Component: CenterLayout,
    children: [
      { index: true, Component: CenterDashboard },
      { path: 'register', Component: StudentRegistration },
      { path: 'marks', Component: MarksEntry },
      { path: 'payments', Component: PaymentTracking },
      { path: 'admit-cards', Component: AdmitCards },
      { path: 'attendance', Component: AttendanceManagement }
    ]
  },
  {
    path: '/student',
    Component: StudentLayout,
    children: [
      { index: true, Component: StudentProfile },
      { path: 'fees', Component: FeePayment },
      { path: 'results', Component: StudentResults }
    ]
  },
  {
    path: '/verify/:studentId',
    Component: VerifyPage
  }
]);
