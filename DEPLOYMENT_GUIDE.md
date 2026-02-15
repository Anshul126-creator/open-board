# OpenBoard Deployment Guide for Hostinger

This guide will help you deploy your OpenBoard application to Hostinger shared hosting.

## Prerequisites

1. **Hostinger account** with shared hosting plan
2. **Domain name** pointed to your Hostinger hosting
3. **SSH access** enabled in your Hostinger control panel
4. **Composer** installed on your local machine
5. **Node.js and npm** installed on your local machine

## Step 1: Prepare Your Application for Production

### 1.1 Update Environment Variables (Already Done)

I've already updated your configuration files:
- `backend/.env` - Set to production mode with your domain
- `frontend/.env` - Updated API URL to your domain
- `backend/config/cors.php` - Added your domain to allowed origins

### 1.2 Generate Application Key

Run this command to generate a new application key for production:

```bash
cd backend
php artisan key:generate
```

### 1.3 Generate JWT Secret

Run this command to generate a secure JWT secret:

```bash
cd backend
php artisan jwt:secret
```

## Step 2: Build Frontend for Production

```bash
cd frontend
npm install
npm run build
```

This will create a production-ready build in the `frontend/dist` directory.

## Step 3: Set Up Database on Hostinger

1. **Log in** to your Hostinger control panel
2. Go to **Databases** > **MySQL Databases**
3. **Create a new database** (e.g., `openboard_db`)
4. **Create a new database user** and assign it to the database
5. **Note down** the database name, username, password, and host

## Step 4: Update Database Configuration

Update your `backend/.env` file with the Hostinger database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=your_hostinger_mysql_host
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
```

## Step 5: Deploy to Hostinger

### Option A: Using FTP (Recommended for Shared Hosting)

1. **Connect via FTP** using FileZilla or similar client:
   - Host: Your Hostinger FTP host (usually your domain or server IP)
   - Username: Your Hostinger FTP username
   - Password: Your Hostinger FTP password
   - Port: 21

2. **Upload files**:
   - Upload the entire `backend` folder to your `public_html` directory
   - Upload the `frontend/dist` contents to a subdirectory like `public_html/frontend`

3. **Set up public directory**:
   - In Hostinger control panel, set the public directory to point to `public_html/backend/public`

### Option B: Using SSH (More Advanced)

1. **Connect via SSH**:
   ```bash
   ssh username@your_server_ip
   ```

2. **Upload files using SCP**:
   ```bash
   scp -r backend/ username@your_server_ip:/home/username/public_html/
   scp -r frontend/dist/* username@your_server_ip:/home/username/public_html/frontend/
   ```

## Step 6: Set Up Laravel on Hostinger

1. **Create a subdomain** (optional but recommended):
   - Go to **Domains** > **Subdomains**
   - Create `api.yourdomain.com` pointing to `public_html/backend/public`

2. **Set up .htaccess**:
   - Ensure your `backend/public/.htaccess` file is properly configured for Laravel

3. **Install Composer dependencies on server**:
   - Hostinger shared hosting has limited SSH access, so you may need to:
     - Install dependencies locally and upload the `vendor` folder
     - OR use Hostinger's built-in Composer (if available)

## Step 7: Run Database Migrations

If you have SSH access, run:

```bash
cd public_html/backend
php artisan migrate --force
php artisan db:seed
```

If not, you'll need to:
1. Run migrations locally with a dump of your database
2. Export the database and import it via phpMyAdmin in Hostinger

## Step 8: Configure Domain and SSL

1. **Point your domain** to Hostinger nameservers
2. **Set up SSL certificate**:
   - Go to **SSL** section in Hostinger control panel
   - Install free Let's Encrypt SSL certificate
3. **Update your .env files** to use `https://` instead of `http://`

## Step 9: Configure CORS and Security

### Update Trusted Proxies

Add this to your `backend/app/Http/Middleware/TrustProxies.php`:

```php
protected $proxies = '*';
```

### Update CORS Settings

I've already updated your CORS settings, but you may need to clear cache:

```bash
php artisan config:clear
php artisan cache:clear
```

## Step 10: Set Up Cron Jobs

For Laravel scheduled tasks, set up a cron job in Hostinger:

1. Go to **Advanced** > **Cron Jobs**
2. Add this command to run every minute:
   ```bash
   * * * * * cd /home/username/public_html/backend && php artisan schedule:run >> /dev/null 2>&1
   ```

## Step 11: Test Your Deployment

1. Visit `https://yourdomain.com` - Should show your frontend
2. Visit `https://yourdomain.com/api` - Should show Laravel API
3. Test API endpoints to ensure they work with your frontend

## Troubleshooting

### Common Issues and Solutions

1. **500 Internal Server Error**:
   - Check file permissions (folders should be 755, files 644)
   - Ensure `storage` folder is writable
   - Check error logs in `backend/storage/logs`

2. **Database Connection Errors**:
   - Verify database credentials in `.env`
   - Check if Hostinger allows remote database connections
   - Try using `127.0.0.1` instead of `localhost`

3. **CORS Errors**:
   - Ensure your frontend domain is in `CORS_ALLOWED_ORIGINS`
   - Clear Laravel cache with `php artisan config:clear`

4. **Frontend Not Loading**:
   - Check that all frontend files are uploaded correctly
   - Verify the API URL in frontend configuration
   - Check browser console for errors

## Hostinger-Specific Notes

1. **PHP Version**: Ensure you're using PHP 8.1 or higher (required for Laravel 12)
2. **Memory Limits**: You may need to increase PHP memory limit in Hostinger settings
3. **Execution Time**: Increase max execution time if migrations take too long
4. **File Uploads**: Check that file upload limits are sufficient for your needs

## Post-Deployment Checklist

- [ ] Test all major frontend pages
- [ ] Test API endpoints with Postman or similar tool
- [ ] Test user authentication (login, registration)
- [ ] Test file uploads (if your app uses them)
- [ ] Set up backups for your database
- [ ] Configure monitoring for uptime
- [ ] Set up email notifications for errors

## Maintenance

### Updating Your Application

1. Make changes locally and test thoroughly
2. Run `npm run build` for frontend changes
3. Upload updated files via FTP/SSH
4. Run `php artisan migrate` if database changes are needed
5. Clear caches: `php artisan cache:clear`, `php artisan config:clear`, `php artisan view:clear`

### Backups

1. Regularly backup your database via phpMyAdmin
2. Download important files via FTP
3. Consider using Hostinger's automatic backup feature

## Support

If you encounter issues specific to Hostinger:
- Contact Hostinger support with error details
- Check Hostinger's knowledge base for Laravel deployment guides
- Ensure your hosting plan supports the requirements (PHP 8.1+, Composer, etc.)