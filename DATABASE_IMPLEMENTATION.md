# PostgreSQL Database Implementation for OpenBoard

## Overview

This document outlines the PostgreSQL database implementation for the OpenBoard Education Management System. The system now includes a full Laravel backend with PostgreSQL database support.

## Database Configuration

### Configuration Files Created

1. **`backend/config/database.php`** - Main database configuration file with PostgreSQL support
2. **`backend/.env.example`** - Environment configuration with PostgreSQL settings

### PostgreSQL Configuration

```php
'pgsql' => [
    'driver' => 'pgsql',
    'url' => env('DATABASE_URL'),
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '5432'),
    'database' => env('DB_DATABASE', 'openboard'),
    'username' => env('DB_USERNAME', 'postgres'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => 'utf8',
    'prefix' => '',
    'prefix_indexes' => true,
    'search_path' => 'public',
    'sslmode' => 'prefer',
],
```

## Database Schema

### Core Tables

1. **users** - User accounts with roles (admin, center, student)
2. **centers** - Educational centers/institutions
3. **students** - Student information and enrollment
4. **classes** - Class/grade information
5. **sessions** - Academic sessions
6. **subjects** - Subjects offered by centers
7. **marks** - Student marks/grades
8. **payments** - Fee payment records
9. **certificates** - Issued certificates and documents

### Relationships

- Users belong to Centers (for center and student roles)
- Students belong to Centers, Classes, and Sessions
- Subjects belong to Centers, Classes, and Sessions
- Marks belong to Students, Subjects, and Sessions
- Payments belong to Students and Sessions
- Certificates belong to Students and Sessions

## Migrations Created

1. `2024_02_14_000000_create_users_table.php`
2. `2024_02_14_000001_create_centers_table.php`
3. `2024_02_14_000002_create_students_table.php`
4. `2024_02_14_000003_create_classes_table.php`
5. `2024_02_14_000004_create_sessions_table.php`
6. `2024_02_14_000005_create_subjects_table.php`
7. `2024_02_14_000006_create_marks_table.php`
8. `2024_02_14_000007_create_payments_table.php`
9. `2024_02_14_000008_create_certificates_table.php`

## Models Created

1. **User.php** - Extended with JWT support and role methods
2. **Center.php** - Center management with status tracking
3. **Student.php** - Student information with relationships
4. **ClassModel.php** - Class/grade management
5. **Session.php** - Academic session management
6. **Subject.php** - Subject configuration
7. **Mark.php** - Student marks recording
8. **Payment.php** - Payment tracking
9. **Certificate.php** - Certificate management

## Database Seeders

- **DatabaseSeeder.php** - Main seeder
- **UserSeeder.php** - Creates admin, center, and student users
- **CenterSeeder.php** - Creates sample centers
- **ClassSeeder.php** - Creates sample classes
- **SessionSeeder.php** - Creates academic sessions
- **SubjectSeeder.php** - Creates subjects for classes
- **StudentSeeder.php** - Creates sample students
- **MarkSeeder.php** - Creates sample marks
- **PaymentSeeder.php** - Creates sample payments
- **CertificateSeeder.php** - Creates sample certificates

## Docker Setup

### Docker Compose Configuration

```yaml
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: openboard
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DB_CONNECTION: pgsql
      DB_HOST: postgres
      DB_PORT: 5432
      DB_DATABASE: openboard
      DB_USERNAME: postgres
      DB_PASSWORD: secret
```

### Dockerfiles

1. **backend/Dockerfile** - PHP 8.2 with PostgreSQL extensions
2. **Dockerfile.frontend** - Node.js 18 for frontend

## Setup Instructions

### Using Docker (Recommended)

```bash
# Start containers
docker-compose up -d

# Run migrations
docker-compose exec backend php artisan migrate

# Seed database (optional)
docker-compose exec backend php artisan db:seed
```

### Manual Setup

```bash
# Install PostgreSQL 15+
# Create database and user

# Backend setup
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve --port=8000

# Frontend setup
npm install
npm run dev
```

## Database Optimization

### Indexes

All foreign key relationships include indexes for performance:
- `center_id` on users, students, classes, sessions, subjects, marks, payments, certificates
- `class_id` on students, subjects
- `session_id` on students, subjects, marks, payments, certificates
- `student_id` on marks, payments, certificates
- `subject_id` on marks

### Data Types

- Appropriate data types for each field (dates, decimals, etc.)
- Proper string lengths for codes and identifiers
- Decimal precision for financial data (payments)

## Security Considerations

1. **Database Credentials**: Store securely in `.env` file (not committed to version control)
2. **SSL Connection**: Configured with `sslmode: prefer`
3. **Foreign Key Constraints**: Cascade deletes to maintain data integrity
4. **Input Validation**: Laravel's built-in validation for all inputs

## Troubleshooting

### Common Issues

1. **Connection refused**: Ensure PostgreSQL is running and accessible
2. **Authentication failed**: Verify database credentials in `.env`
3. **Migration errors**: Check for existing tables or run `php artisan migrate:fresh`
4. **Dependency issues**: Run `composer install` in backend directory

### Debugging

```bash
# Check database connection
php artisan db:show

# Run specific migration
php artisan migrate --path=/database/migrations/filename.php

# Rollback migrations
php artisan migrate:rollback
```

## Future Enhancements

1. **Database Backups**: Implement automated backup system
2. **Connection Pooling**: Configure for production environments
3. **Read Replicas**: Set up for scalability
4. **Query Optimization**: Add indexes based on usage patterns
5. **Caching**: Implement Redis caching for frequently accessed data

## Migration from LocalStorage

The application has been successfully migrated from a frontend-only localStorage implementation to a full PostgreSQL database backend. All data is now persisted in the database with proper relationships and constraints.