# Thunderbird Logs Dashboard

A Laravel + React application for managing and monitoring various logs including HubSpot logs, Channel Partners sync logs, contacts, submissions, and collaterals.

## System Requirements

- **PHP**: 8.2 or higher
- **Node.js**: 18.x or higher
- **NPM**: 9.x or higher
- **MySQL**: 8.0 or higher
- **Composer**: 2.x
- **Web Server**: Apache 2.4+ or Nginx 1.18+

## Production Deployment Guide

### 1. Server Setup

#### Install Required Software
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install PHP 8.2 and required extensions
sudo apt install -y php8.2 php8.2-fpm php8.2-mysql php8.2-xml php8.2-curl php8.2-zip php8.2-mbstring php8.2-gd php8.2-bcmath php8.2-intl php8.2-redis

# Install MySQL
sudo apt install -y mysql-server

# Install Node.js and NPM
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

### 2. Database Setup

#### Create Database and User
```sql
-- Login to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE thunderbird_logs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user and grant privileges
CREATE USER 'thunderbird_user'@'localhost' IDENTIFIED BY 'your_secure_password_here';
GRANT ALL PRIVILEGES ON thunderbird_logs.* TO 'thunderbird_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Application Deployment

#### Clone and Setup Application
```bash
# Navigate to your web directory
cd /var/www/html

# Create thunderlog directory
sudo mkdir -p thunderlog
sudo chown $USER:$USER thunderlog
cd thunderlog

# Clone your repository (replace with your actual repository URL)
git clone https://github.com/your-username/thunderbird-logs-dashboard.git .

# Install PHP dependencies
composer install --optimize-autoloader --no-dev

# Install Node.js dependencies
npm ci --only=production

# Set proper permissions
sudo chown -R www-data:www-data /var/www/html/thunderlog
sudo chmod -R 755 /var/www/html/thunderlog
sudo chmod -R 775 /var/www/html/thunderlog/storage
sudo chmod -R 775 /var/www/html/thunderlog/bootstrap/cache
```

#### Environment Configuration
```bash
# Copy production environment file
cp .env.production .env

# Generate application key
php artisan key:generate

# Edit environment file with your actual values
nano .env
```

**Important**: Update the following values in your `.env` file:
- `APP_KEY` (generated automatically)
- `DB_PASSWORD` (your actual database password)
- `MAIL_HOST`, `MAIL_USERNAME`, `MAIL_PASSWORD` (your SMTP settings)

#### Database Migration
```bash
# Run database migrations
php artisan migrate --force

# Seed initial data (if you have seeders)
php artisan db:seed --force
```

#### Build Assets
```bash
# Build production assets
npm run build

# Clear and cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 4. Web Server Configuration

#### Apache Configuration

Create `/etc/apache2/sites-available/thunderlog.conf`:
```apache
<VirtualHost *:80>
    ServerName api.trythunderbird.com
    DocumentRoot /var/www/html
    
    # Redirect HTTP to HTTPS
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</VirtualHost>

<VirtualHost *:443>
    ServerName api.trythunderbird.com
    DocumentRoot /var/www/html
    
    # SSL Configuration (configure with your SSL certificates)
    SSLEngine on
    SSLCertificateFile /path/to/your/certificate.crt
    SSLCertificateKeyFile /path/to/your/private.key
    SSLCertificateChainFile /path/to/your/chain.crt
    
    # Thunderlog Application
    Alias /thunderlog /var/www/html/thunderlog/public
    <Directory "/var/www/html/thunderlog/public">
        AllowOverride All
        Require all granted
        
        # Laravel Pretty URLs
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.php [L]
    </Directory>
    
    # Security Headers
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Logging
    ErrorLog ${APACHE_LOG_DIR}/thunderlog_error.log
    CustomLog ${APACHE_LOG_DIR}/thunderlog_access.log combined
</VirtualHost>
```

#### Nginx Configuration (Alternative)

Create `/etc/nginx/sites-available/thunderlog`:
```nginx
server {
    listen 80;
    server_name api.trythunderbird.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.trythunderbird.com;
    root /var/www/html;
    index index.php index.html index.htm;

    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Thunderlog Application
    location /thunderlog {
        alias /var/www/html/thunderlog/public;
        try_files $uri $uri/ @thunderlog;
        
        location ~ \.php$ {
            include snippets/fastcgi-php.conf;
            fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
            fastcgi_param SCRIPT_FILENAME $request_filename;
        }
    }
    
    location @thunderlog {
        rewrite /thunderlog/(.*)$ /thunderlog/index.php?/$1 last;
    }

    # Security Headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Logging
    access_log /var/log/nginx/thunderlog_access.log;
    error_log /var/log/nginx/thunderlog_error.log;
}
```

#### Enable Site and Restart Web Server

**For Apache:**
```bash
sudo a2ensite thunderlog.conf
sudo a2enmod rewrite ssl headers
sudo systemctl restart apache2
```

**For Nginx:**
```bash
sudo ln -s /etc/nginx/sites-available/thunderlog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Process Management (Optional but Recommended)

#### Setup Queue Worker with Supervisor
```bash
# Install Supervisor
sudo apt install supervisor

# Create supervisor configuration
sudo nano /etc/supervisor/conf.d/thunderlog-worker.conf
```

Add the following content:
```ini
[program:thunderlog-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/html/thunderlog/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/html/thunderlog/storage/logs/worker.log
stopwaitsecs=3600
```

```bash
# Update supervisor configuration
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start thunderlog-worker:*
```

### 6. SSL Certificate Setup

#### Using Let's Encrypt (Recommended)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache  # For Apache
# OR
sudo apt install certbot python3-certbot-nginx   # For Nginx

# Obtain SSL certificate
sudo certbot --apache -d api.trythunderbird.com  # For Apache
# OR
sudo certbot --nginx -d api.trythunderbird.com   # For Nginx

# Setup automatic renewal
sudo crontab -e
# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

### 7. Monitoring and Maintenance

#### Setup Log Rotation
```bash
sudo nano /etc/logrotate.d/thunderlog
```

Add:
```
/var/www/html/thunderlog/storage/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 644 www-data www-data
}
```

#### Backup Script
Create `/home/ubuntu/backup-thunderlog.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
APP_DIR="/var/www/html/thunderlog"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u thunderbird_user -p thunderbird_logs > $BACKUP_DIR/db_backup_$DATE.sql

# Backup application files (excluding vendor and node_modules)
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz -C $APP_DIR --exclude=vendor --exclude=node_modules --exclude=storage/logs .

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

Make it executable and add to crontab:
```bash
chmod +x /home/ubuntu/backup-thunderlog.sh
crontab -e
# Add: 0 2 * * * /home/ubuntu/backup-thunderlog.sh
```

## Post-Deployment Checklist

- [ ] Application accessible at https://api.trythunderbird.com/thunderlog/
- [ ] Database connection working
- [ ] All migrations completed successfully
- [ ] Assets compiled and loading correctly
- [ ] SSL certificate installed and working
- [ ] Email functionality tested
- [ ] Queue workers running (if applicable)
- [ ] Log files being written correctly
- [ ] Backup system configured
- [ ] Monitoring setup completed

## Troubleshooting

### Common Issues

1. **Directory Listing Instead of Application Loading**
   
   If you see a directory listing when visiting `https://api.trythunderbird.com/thunderlog/`, this means the web server is not properly configured:
   
   **Solution:**
   ```bash
   # Ensure the document root points to the public directory
   # For Apache, your virtual host should have:
   # DocumentRoot /var/www/html/thunderlog/public
   
   # Check if mod_rewrite is enabled
   sudo a2enmod rewrite
   sudo systemctl restart apache2
   
   # Verify .htaccess file exists and is readable
   ls -la /var/www/html/thunderlog/public/.htaccess
   
   # Ensure DirectoryIndex is set correctly in your virtual host:
   # DirectoryIndex index.php index.html
   ```
   
   **For Nginx:**
   ```nginx
   # Ensure your server block has:
   root /var/www/html/thunderlog/public;
   index index.php index.html index.htm;
   ```

2. **Permission Errors**
   ```bash
   sudo chown -R www-data:www-data /var/www/html/thunderlog
   sudo chmod -R 755 /var/www/html/thunderlog
   sudo chmod -R 775 /var/www/html/thunderlog/storage
   sudo chmod -R 775 /var/www/html/thunderlog/bootstrap/cache
   ```

3. **Asset Loading Issues**
   ```bash
   npm run build
   php artisan config:cache
   ```

4. **Database Connection Issues**
   - Verify database credentials in `.env`
   - Check MySQL service status: `sudo systemctl status mysql`
   - Test connection: `php artisan tinker` then `DB::connection()->getPdo();`

5. **Queue Not Processing**
   ```bash
   sudo supervisorctl restart thunderlog-worker:*
   php artisan queue:restart
   ```

## Development vs Production

This README focuses on production deployment. For local development:
- Use the existing `.env` file
- Run `composer install` (without --no-dev flag)
- Run `npm install` (without --only=production flag)
- Use `php artisan serve` and `npm run dev`

## Support

For issues related to deployment or configuration, check the Laravel documentation at https://laravel.com/docs or create an issue in the project repository.
