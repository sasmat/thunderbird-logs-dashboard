# Thunderbird Logs Dashboard - Production Deployment Checklist

## Pre-Deployment Preparation

### ✅ Files Created/Modified for Production

1. **README.md** - Comprehensive deployment guide
2. **.env.production** - Production environment template
3. **deploy.sh** - Automated deployment script (executable)
4. **public/.htaccess** - Enhanced with security headers and optimizations
5. **DEPLOYMENT_CHECKLIST.md** - This checklist

### ✅ Production Configuration Summary

- **Application URL**: `https://api.trythunderbird.com/thunderlog/`
- **Environment**: Production
- **Debug Mode**: Disabled
- **Logging Level**: Error
- **Session Encryption**: Enabled
- **Database**: MySQL with dedicated user
- **Security Headers**: Implemented
- **Asset Compression**: Enabled
- **Browser Caching**: Configured

## Server Requirements Verification

- [ ] **PHP 8.2+** installed with required extensions:
  - php8.2-fpm, php8.2-mysql, php8.2-xml, php8.2-curl
  - php8.2-zip, php8.2-mbstring, php8.2-gd, php8.2-bcmath
  - php8.2-intl, php8.2-redis
- [ ] **MySQL 8.0+** installed and running
- [ ] **Node.js 18.x+** and NPM installed
- [ ] **Composer 2.x** installed
- [ ] **Web Server** (Apache 2.4+ or Nginx 1.18+) configured
- [ ] **SSL Certificate** ready for installation

## Database Setup

- [ ] MySQL database `thunderbird_logs` created
- [ ] Database user `thunderbird_user` created with proper privileges
- [ ] Database connection tested

## Application Deployment Steps

### 1. Initial Setup
- [ ] Navigate to `/var/www/html/`
- [ ] Create `thunderlog` directory with proper ownership
- [ ] Clone repository to the directory
- [ ] Set proper file permissions (755 for directories, 644 for files)

### 2. Dependencies Installation
- [ ] Run `composer install --optimize-autoloader --no-dev`
- [ ] Run `npm ci --only=production`

### 3. Environment Configuration
- [ ] Copy `.env.production` to `.env`
- [ ] Update database credentials in `.env`
- [ ] Update mail configuration in `.env`
- [ ] Generate application key: `php artisan key:generate`

### 4. Database Migration
- [ ] Run `php artisan migrate --force`
- [ ] Verify all tables created successfully

### 5. Asset Compilation
- [ ] Run `npm run build`
- [ ] Verify assets compiled in `public/build/` directory

### 6. Laravel Optimization
- [ ] Run `php artisan config:cache`
- [ ] Run `php artisan route:cache`
- [ ] Run `php artisan view:cache`

### 7. Permissions Setup
- [ ] Set storage permissions: `chmod -R 775 storage bootstrap/cache`
- [ ] Set ownership: `chown -R www-data:www-data storage bootstrap/cache`

## Web Server Configuration

### Apache Configuration
- [ ] Create virtual host configuration file
- [ ] Configure SSL certificates
- [ ] Enable required modules: `rewrite`, `ssl`, `headers`
- [ ] Enable site and restart Apache

### Nginx Configuration (Alternative)
- [ ] Create server block configuration
- [ ] Configure SSL certificates
- [ ] Test configuration: `nginx -t`
- [ ] Restart Nginx

## SSL Certificate Setup

- [ ] Install Certbot
- [ ] Obtain SSL certificate for `api.trythunderbird.com`
- [ ] Configure automatic renewal
- [ ] Test HTTPS access

## Optional Production Enhancements

### Queue Workers (Recommended)
- [ ] Install Supervisor
- [ ] Configure queue worker process
- [ ] Start queue workers
- [ ] Verify workers are running

### Monitoring & Maintenance
- [ ] Configure log rotation
- [ ] Set up backup script
- [ ] Configure cron jobs for backups
- [ ] Set up monitoring (optional)

## Post-Deployment Testing

### Functionality Tests
- [ ] **Application Access**: Visit `https://api.trythunderbird.com/thunderlog/`
- [ ] **Database Connection**: Verify no database errors
- [ ] **Asset Loading**: Check CSS/JS files load correctly
- [ ] **Authentication**: Test login functionality
- [ ] **Navigation**: Test all menu items and routes
- [ ] **CRUD Operations**: Test create, read, update, delete operations

### Security Tests
- [ ] **HTTPS Redirect**: Verify HTTP redirects to HTTPS
- [ ] **Security Headers**: Check headers using browser dev tools
- [ ] **File Access**: Verify sensitive files are blocked
- [ ] **Directory Listing**: Ensure directory browsing is disabled

### Performance Tests
- [ ] **Page Load Speed**: Check initial load time
- [ ] **Asset Compression**: Verify gzip compression is working
- [ ] **Browser Caching**: Check cache headers are set

## Troubleshooting Common Issues

### Permission Errors
```bash
sudo chown -R www-data:www-data /var/www/html/thunderlog
sudo chmod -R 755 /var/www/html/thunderlog
sudo chmod -R 775 /var/www/html/thunderlog/storage
sudo chmod -R 775 /var/www/html/thunderlog/bootstrap/cache
```

### Asset Loading Issues
```bash
npm run build
php artisan config:cache
```

### Database Connection Issues
- Verify credentials in `.env`
- Check MySQL service: `sudo systemctl status mysql`
- Test connection: `php artisan tinker` then `DB::connection()->getPdo();`

## Automated Deployment

For future deployments, use the provided deployment script:

```bash
# Make script executable (first time only)
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

## Final Verification Checklist

- [ ] Application accessible at `https://api.trythunderbird.com/thunderlog/`
- [ ] All pages load without errors
- [ ] Database operations working
- [ ] Email functionality tested (if applicable)
- [ ] SSL certificate valid and auto-renewing
- [ ] Security headers present
- [ ] Performance optimizations active
- [ ] Backup system configured
- [ ] Monitoring setup (if applicable)

## Support & Maintenance

### Regular Maintenance Tasks
- Monitor application logs: `tail -f storage/logs/laravel.log`
- Check disk space and clean old logs
- Update dependencies periodically
- Monitor SSL certificate expiration
- Review and rotate backup files

### Emergency Contacts
- Server Administrator: [Your Contact]
- Database Administrator: [Your Contact]
- Application Developer: [Your Contact]

---

**Deployment Date**: ___________
**Deployed By**: ___________
**Version**: ___________
**Notes**: ___________
