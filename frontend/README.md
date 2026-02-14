# Education Management System

A comprehensive multi-panel education management system with Admin, Center, and Student interfaces.

## Features

### Admin Panel (admin@edu.com / admin123)
- **Dashboard**: View statistics for students, centers, revenue, and sessions with interactive charts
- **Center Management**: Approve/suspend centers, add new centers
- **Student Master List**: View all registered students across centers with filtering
- **Subject Setup**: Configure subjects for each class
- **Session Setup**: Manage academic sessions (e.g., 2026-27)
- **Fee Structure**: Set fees for different classes and sessions
- **Timetable Upload**: Upload timetables for classes
- **Result Publishing**: Publish results for students to view

### Center Panel (center1@edu.com / center123)
- **Dashboard**: Overview of center's students and activities
- **Student Registration**: Register new students with complete details
- **Marks Entry**: 
  - Single entry for individual students
  - Bulk CSV upload for multiple marks
- **Payment Tracking**: Monitor payment status of students
- **Admit Cards**: Download admit cards for students

### Student Panel (student@edu.com / student123)
- **Profile View**: View complete personal and academic information
- **Fee Payment**: Mock Razorpay integration for fee payment
- **Results & Documents**:
  - View subject-wise marks and overall percentage
  - Download admit card (PDF with QR code)
  - Download marksheet (PDF with QR code)
  - Download certificate (PDF)
  - QR verification link for document authentication

### Additional Features
- **QR Code Verification**: All documents include QR codes that link to a verification page
- **Document Verification Page**: Public page to verify student documents using QR codes
- **Responsive Design**: Works on desktop and mobile devices
- **LocalStorage Persistence**: All data is saved locally for demonstration

## Technology Stack
- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Recharts for data visualization
- jsPDF for PDF generation
- QRCode for QR code generation
- PapaParse for CSV parsing
- Shadcn/ui components

## Demo Credentials
- **Admin**: admin@edu.com / admin123
- **Center**: center1@edu.com / center123
- **Student**: student@edu.com / student123

## How to Use

1. Login with any of the demo credentials
2. Admin can:
   - Add centers, sessions, subjects, and fee structures
   - View all students and centers
   - Publish results
3. Center can:
   - Register students
   - Enter marks (individually or via CSV)
   - Track payments
   - Download admit cards
4. Student can:
   - View their profile
   - Pay fees (mock payment)
   - View results (when published)
   - Download documents with QR verification

## CSV Format for Bulk Marks Upload
```csv
rollNumber,subjectCode,marks
DCI001001,MATH,85
DCI001001,SCI,90
```

## Notes
- This is a frontend-only demonstration using localStorage
- In production, integrate with Supabase or similar backend
- Payment integration is mocked (not real Razorpay)
- QR codes link to verification pages on the same domain
