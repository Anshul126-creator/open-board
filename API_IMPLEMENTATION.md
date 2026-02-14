# API Implementation for OpenBoard

## Overview

This document outlines the API implementation for the OpenBoard Education Management System, including fixes to the frontend API service and backend controller implementation.

## Frontend API Service Fixes

### Fixed Issues in `frontend/src/app/services/api.ts`

1. **Toast Import Fix**:
   - Changed from `import { Toaster } from '../components/ui/sonner'`
   - To: `import { toast } from 'sonner'`
   - This fixes the toast error display functionality

2. **Type Safety Improvements**:
   - Updated `AxiosRequestConfig` to `any` for better compatibility
   - Added proper type casting for `error.config` in response interceptor

3. **Error Handling**:
   - Ensured proper error message extraction and display
   - Maintained consistent error response structure

### API Service Structure

The API service provides the following services:

- **AuthService**: Authentication and user management
- **CenterService**: Center CRUD operations
- **StudentService**: Student management
- **MarksService**: Marks entry and retrieval
- **PaymentService**: Payment processing
- **SessionService**: Academic session management
- **ClassService**: Class management
- **SubjectService**: Subject management
- **FeeStructureService**: Fee configuration
- **TimetableService**: Timetable upload/download
- **ResultService**: Result publishing
- **CertificateService**: Certificate generation

## Backend API Implementation

### Controllers Created

1. **AuthController** - User authentication and JWT token management
2. **CenterController** - Center CRUD operations with status updates
3. **StudentController** - Student management with profile retrieval
4. **MarkController** - Marks entry (single and bulk) with student/subject filtering
5. **PaymentController** - Payment processing and tracking
6. **SessionController** - Academic session management
7. **ClassController** - Class/grade management
8. **SubjectController** - Subject configuration
9. **FeeStructureController** - Fee structure management
10. **TimetableController** - Timetable upload and download
11. **ResultController** - Result publishing and retrieval
12. **CertificateController** - Certificate generation and download

### API Routes

All routes are defined in `backend/routes/api.php` with proper middleware:

- **Public Routes**: Authentication endpoints
- **Protected Routes**: All CRUD operations require JWT authentication
- **Resource Routes**: Standard RESTful endpoints for all entities
- **Custom Routes**: Special endpoints for bulk operations, downloads, etc.

### Request/Response Format

**Request Headers**:
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer {jwt_token}
```

**Success Response**:
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Error message",
  "errors": {} // Validation errors if applicable
}
```

## Authentication Flow

### Login
```
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "access_token": "jwt_token_here",
    "refresh_token": "refresh_token_here",
    "user": {}
  },
  "message": "Login successful"
}
```

### Token Refresh
```
POST /api/auth/refresh
{
  "refresh_token": "refresh_token_here"
}
```

### Logout
```
POST /api/auth/logout
```

### Current User
```
GET /api/auth/me
```

## Key API Endpoints

### Center Management
- `GET /api/centers` - List all centers
- `POST /api/centers` - Create new center
- `GET /api/centers/{id}` - Get center details
- `PUT /api/centers/{id}` - Update center
- `PUT /api/centers/{id}/status` - Update center status
- `DELETE /api/centers/{id}` - Delete center

### Student Management
- `GET /api/students` - List all students
- `POST /api/students` - Register new student
- `GET /api/students/{id}` - Get student details
- `GET /api/students/{id}/profile` - Get student profile with all relations
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student

### Marks Management
- `GET /api/marks` - List all marks
- `POST /api/marks` - Enter single mark
- `POST /api/marks/bulk` - Bulk upload marks
- `GET /api/marks/student/{student}` - Get marks by student
- `GET /api/marks/subject/{subject}` - Get marks by subject
- `PUT /api/marks/{id}` - Update mark
- `DELETE /api/marks/{id}` - Delete mark

### Payment Processing
- `GET /api/payments` - List all payments
- `POST /api/payments` - Record payment
- `GET /api/payments/student/{student}` - Get payments by student
- `PUT /api/payments/{id}` - Update payment
- `DELETE /api/payments/{id}` - Delete payment

## Error Handling

The API implements comprehensive error handling:

1. **Validation Errors** (422): Return detailed validation messages
2. **Authentication Errors** (401): Handle expired tokens with refresh logic
3. **Authorization Errors** (403): Forbidden access
4. **Not Found Errors** (404): Resource not found
5. **Server Errors** (500): Internal server errors

## Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Token Refresh**: Automatic token refresh on expiration
3. **CSRF Protection**: Laravel's built-in CSRF protection
4. **Input Validation**: Comprehensive validation for all inputs
5. **Authorization**: Role-based access control

## Testing the API

### Using Postman/Insomnia

1. **Login**: `POST /api/auth/login`
2. **Use token**: Add `Authorization: Bearer {token}` header
3. **Test endpoints**: Call protected endpoints with the token

### Using cURL

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@edu.com","password":"admin123"}'

# Get centers (with token)
curl -X GET http://localhost:8000/api/centers \
  -H "Authorization: Bearer {your_token}"
```

## Integration with Frontend

The frontend API service automatically:

1. **Adds JWT token** to all requests when available
2. **Handles token refresh** when 401 errors occur
3. **Displays error messages** using toast notifications
4. **Redirects to login** when authentication fails
5. **Manages localStorage** for tokens and user data

## Performance Considerations

1. **Eager Loading**: All controllers use `with()` for relationships
2. **Pagination**: Can be added for large datasets
3. **Caching**: Can be implemented for frequently accessed data
4. **Database Indexes**: Proper indexes on foreign keys

## Future Enhancements

1. **Rate Limiting**: Implement API rate limiting
2. **API Documentation**: Add Swagger/OpenAPI documentation
3. **Webhooks**: Add webhook support for important events
4. **GraphQL**: Consider GraphQL for complex queries
5. **Real-time Updates**: Add WebSocket support

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure CORS middleware is properly configured
2. **401 Unauthorized**: Check token validity and refresh logic
3. **404 Not Found**: Verify endpoint URLs and HTTP methods
4. **500 Server Error**: Check Laravel logs for details

### Debugging

```bash
# Check Laravel logs
php artisan log:clear
tail -f storage/logs/laravel.log

# Test database connection
php artisan db:show
php artisan migrate:status
```

## Conclusion

The API implementation provides a robust, secure, and well-structured backend for the OpenBoard Education Management System. The frontend API service has been fixed and properly integrated with the backend controllers, ensuring smooth communication between the React frontend and Laravel backend.