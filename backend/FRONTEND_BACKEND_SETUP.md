# OpenBoard Frontend & Backend Setup Guide

This guide provides comprehensive instructions for setting up and deploying the OpenBoard school management system with both frontend and backend components.

## 📁 Project Structure

```
openboard/
├── backend/          # Laravel backend (current directory)
├── frontend/         # React frontend with Tailwind CSS
└── README.md         # Main project documentation
```

## 🚀 Quick Start

### Prerequisites

- PHP 8.1+
- Composer 2.x
- Node.js 18+
- PostgreSQL 14+
- npm/yarn

### 1. Backend Setup

```bash
# Navigate to backend directory
cd /home/anshul/openboard/backend

# Install PHP dependencies
composer install

# Copy .env file and configure
cp .env.example .env
php artisan key:generate

# Configure database in .env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=openboard
DB_USERNAME=postgres
DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Generate JWT secret
php artisan jwt:secret

# Start development server
php artisan serve --port=8000
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd /home/anshul/openboard/frontend

# Install dependencies
npm install

# Install additional dependencies
npm install react-router-dom @heroicons/react axios

# Create Tailwind configuration
npx tailwindcss init -p

# Start development server
npm run dev
```

## 🔧 Configuration

### Backend Configuration

#### CORS Settings (`config/cors.php`)

```php
'allowed_origins' => [
    'http://localhost:3000',  // Development frontend
    env('FRONTEND_URL', 'http://localhost:3000'), // Production frontend
],
'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
'supports_credentials' => true,
```

#### Environment Variables (`.env`)

```env
# Frontend URL for production
FRONTEND_URL=http://your-production-frontend.com

# CORS settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://your-production-frontend.com
CORS_ALLOWED_METHODS=GET,POST,PUT,PATCH,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization,X-Requested-With,Accept,X-CSRF-TOKEN

# JWT Settings
JWT_SECRET=your_jwt_secret_key
JWT_TTL=60
JWT_REFRESH_TTL=20160
```

### Frontend Configuration

#### Vite Config (`vite.config.js`)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
```

#### Tailwind Config (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
}
```

## 🛠️ API Integration

### Authentication Flow

1. **Login**: `POST /api/auth/login`
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

2. **Get User**: `GET /api/auth/me` (requires `Authorization: Bearer <token>`)

3. **Logout**: `POST /api/auth/logout`

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

#### Frontend
- `GET /api/frontend/config` - Get frontend configuration

#### Core Resources
- `GET /api/students` - List all students
- `POST /api/students` - Create student
- `GET /api/students/{id}` - Get student details
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student

## 📦 Production Deployment

### Backend Deployment

#### Option 1: Traditional Server

```bash
# Install dependencies
composer install --optimize-autoloader --no-dev

# Set up environment
cp .env.example .env
php artisan key:generate
php artisan jwt:secret

# Run migrations
php artisan migrate --force

# Optimize application
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set up queue worker (if using queues)
nohup php artisan queue:work --daemon &

# Set up scheduler
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

#### Option 2: Docker

Create a `Dockerfile`:

```dockerfile
FROM php:8.2-fpm-alpine

WORKDIR /var/www/html

# Install dependencies
RUN docker-php-ext-install pdo pdo_pgsql bcmath ctype file mbstring tokenize

# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application
COPY . .

# Install PHP dependencies
RUN composer install --optimize-autoloader --no-dev

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage
RUN chmod -R 775 /var/www/html/storage

EXPOSE 9000
CMD ["php-fpm"]
```

### Frontend Deployment

```bash
# Build for production
npm run build

# The output will be in the `dist` directory
# You can serve this with any static file server

# For Nginx configuration:
server {
    listen 80;
    server_name yourdomain.com;
    
    root /path/to/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://backend:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🧪 Testing

### Backend Tests

```bash
php artisan test
```

### Frontend Tests

```bash
npm test
```

## 🔒 Security Best Practices

### Backend Security

1. **Environment Configuration**:
   - Set `APP_DEBUG=false` in production
   - Set `APP_ENV=production`
   - Use strong database credentials

2. **JWT Security**:
   - Set appropriate token expiration times
   - Use HTTPS in production
   - Store JWT secret securely

3. **Rate Limiting**:
   - Configure API rate limiting in `app/Providers/RouteServiceProvider.php`

### Frontend Security

1. **Environment Variables**:
   - Use `VITE_` prefix for frontend environment variables
   - Never expose sensitive keys in frontend code

2. **Authentication**:
   - Store JWT tokens securely (HttpOnly cookies recommended)
   - Implement proper token refresh logic

3. **API Security**:
   - Always validate API responses
   - Implement proper error handling
   - Use CSRF protection for state-changing requests

## 📈 Performance Optimization

### Backend Optimization

1. **Database**:
   - Add proper indexes
   - Use database caching
   - Optimize queries with eager loading

2. **Application**:
   - Cache configurations and routes
   - Use queue workers for background jobs
   - Implement proper caching strategies

### Frontend Optimization

1. **Build Optimization**:
   - Use code splitting
   - Enable compression
   - Optimize images and assets

2. **Performance**:
   - Implement lazy loading
   - Use React.memo for components
   - Optimize bundle size

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure `FRONTEND_URL` is correctly set in backend `.env`
   - Verify CORS configuration in `config/cors.php`
   - Clear Laravel cache: `php artisan config:clear`

2. **Authentication Issues**:
   - Check JWT secret is generated: `php artisan jwt:secret`
   - Verify token expiration times
   - Check token storage in frontend

3. **Database Connection**:
   - Verify database credentials in `.env`
   - Check database server is running
   - Test connection: `php artisan db:show`

## 🎯 Next Steps

1. **Customize the UI**: Modify Tailwind colors and components to match your brand
2. **Extend API**: Add more endpoints as needed for your specific requirements
3. **Add Features**: Implement additional functionality like:
   - Student management
   - Class scheduling
   - Grade reporting
   - Payment processing
4. **Set up Monitoring**: Add logging and error tracking
5. **Implement CI/CD**: Set up continuous integration and deployment

## 📚 Additional Resources

- **Laravel Documentation**: https://laravel.com/docs
- **React Documentation**: https://react.dev/learn
- **Tailwind CSS Documentation**: https://tailwindcss.com/docs
- **Vite Documentation**: https://vitejs.dev/guide/

This setup provides a production-ready foundation for your OpenBoard school management system with a modern React frontend and robust Laravel backend.