#!/bin/bash

# Thunderbird Logs Dashboard - Production Deployment Script
# Usage: ./deploy.sh

set -e

echo "🚀 Starting Thunderbird Logs Dashboard deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "artisan" ]; then
    print_error "artisan file not found. Please run this script from the Laravel project root."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_error ".env file not found. Please copy .env.production to .env and configure it."
    exit 1
fi

print_status "Putting application in maintenance mode..."
php artisan down --retry=60

# Function to handle cleanup on exit
cleanup() {
    print_status "Bringing application back online..."
    php artisan up
}
trap cleanup EXIT

print_status "Pulling latest changes from repository..."
git pull origin main

print_status "Installing/updating PHP dependencies..."
composer install --optimize-autoloader --no-dev --no-interaction

print_status "Installing/updating Node.js dependencies..."
npm ci --only=production

print_status "Building production assets..."
npm run build

print_status "Running database migrations..."
php artisan migrate --force

print_status "Clearing and caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

print_status "Clearing application cache..."
php artisan cache:clear

print_status "Optimizing autoloader..."
composer dump-autoload --optimize

print_status "Setting proper permissions..."
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

print_status "Restarting queue workers..."
php artisan queue:restart

print_status "Deployment completed successfully! 🎉"

# Remove the trap so we don't run cleanup twice
trap - EXIT

print_status "Bringing application back online..."
php artisan up

print_status "Running post-deployment checks..."

# Check if the application is responding
if curl -f -s "https://api.trythunderbird.com/thunderlog/" > /dev/null; then
    print_status "✅ Application is responding correctly"
else
    print_warning "⚠️  Application might not be responding. Please check manually."
fi

print_status "Deployment completed! 🚀"
print_status "Application URL: https://api.trythunderbird.com/thunderlog/"

echo ""
echo "📋 Post-deployment checklist:"
echo "- [ ] Verify application is accessible"
echo "- [ ] Check logs for any errors"
echo "- [ ] Test critical functionality"
echo "- [ ] Monitor performance"
