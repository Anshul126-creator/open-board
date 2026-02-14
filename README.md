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

### Frontend
- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Recharts for data visualization
- jsPDF for PDF generation
- QRCode for QR code generation
- PapaParse for CSV parsing
- Shadcn/ui components

### Backend
- Laravel 10
- PostgreSQL database
- JWT Authentication
- Laravel Sanctum
- Spatie Query Builder
=======

## Demo Credentials
- **Admin**: admin@edu.com / admin123
- **Center**: center1@edu.com / center123
- **Student**: student@edu.com / student123

## Setup and Installation

### Prerequisites
- Docker and Docker Compose
- Node.js (for frontend development)
- PHP 8.1+ (for backend development)
- PostgreSQL 15+

### Using Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/openboard.git
   cd openboard
   ```

2. **Set up environment variables:**
   ```bash
   cp backend/.env.example backend/.env
   # Edit the .env file with your PostgreSQL credentials
   ```

3. **Start the containers:**
   ```bash
   docker-compose up -d
   ```

4. **Run migrations:**
   ```bash
   docker-compose exec backend php artisan migrate
   ```

5. **Seed the database (optional):**
   ```bash
   docker-compose exec backend php artisan db:seed
   ```

6. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - PostgreSQL: localhost:5432

### Manual Setup

1. **Set up PostgreSQL:**
   - Install PostgreSQL 15+
   - Create a database named `openboard`
   - Create a user with appropriate permissions

2. **Backend setup:**
   ```bash
   cd backend
   cp .env.example .env
   composer install
   php artisan key:generate
   php artisan migrate
   php artisan serve --port=8000
   ```

3. **Frontend setup:**
   ```bash
   npm install
   npm run dev
   ```

## Database Schema

The application uses PostgreSQL with the following main tables:

- **users**: Stores user accounts (admin, center, student)
- **centers**: Educational centers/institutions
- **students**: Student information and enrollment
- **classes**: Class/grade information
- **sessions**: Academic sessions
- **subjects**: Subjects offered
- **marks**: Student marks/grades
- **payments**: Fee payment records
- **certificates**: Issued certificates and documents

## API Endpoints

The backend provides RESTful API endpoints for:

- Authentication (JWT)
- User management
- Center management
- Student registration
- Marks entry and retrieval
- Payment processing
- Document generation
- Reporting and analytics

## How to Use

1. **Login with credentials**
2. **Admin can:**
   - Manage centers, sessions, subjects, and fee structures
   - View all students and centers
   - Publish results
3. **Center can:**
   - Register students
   - Enter marks (individually or via CSV)
   - Track payments
   - Download admit cards
4. **Student can:**
   - View their profile
   - Pay fees
   - View results (when published)
   - Download documents with QR verification
=======

## CSV Format for Bulk Marks Upload
```csv
rollNumber,subjectCode,marks
DCI001001,MATH,85
DCI001001,SCI,90
```

## Notes

- The application now includes a full Laravel backend with PostgreSQL database
- JWT authentication is implemented for secure API access
- All data is persisted in the database
- Payment integration is mocked (not real Razorpay)
- QR codes link to verification pages on the same domain
- For production, configure proper database backups and security

## Database Configuration

The application uses PostgreSQL with the following default configuration:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=openboard
DB_USERNAME=postgres
DB_PASSWORD=
```

You can modify these settings in the `backend/.env` file.

## Troubleshooting

### Database connection issues
- Ensure PostgreSQL is running
- Verify the connection details in `.env` file
- Check that the database user has proper permissions

### Migration errors
- Run `php artisan migrate:fresh` to reset and re-run migrations
- Check for foreign key constraints if dropping tables

### Docker issues
- Ensure Docker and Docker Compose are installed
- Check container logs with `docker-compose logs`
- Restart containers with `docker-compose down && docker-compose up -d`
=======
