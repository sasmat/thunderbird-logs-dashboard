<?php
/**
 * Test script to verify root-level Laravel setup
 */

echo "=== Testing Root-Level Laravel Setup ===\n\n";

// Test 1: Check if index.php exists in root
echo "1. Checking root index.php: ";
if (file_exists(__DIR__ . '/index.php')) {
    echo "✓ EXISTS\n";
} else {
    echo "✗ MISSING\n";
}

// Test 2: Check if .htaccess exists in root
echo "2. Checking root .htaccess: ";
if (file_exists(__DIR__ . '/.htaccess')) {
    echo "✓ EXISTS\n";
} else {
    echo "✗ MISSING\n";
}

// Test 3: Check if public directory and its contents exist
echo "3. Checking public directory structure:\n";
$publicFiles = ['index.php', '.htaccess', 'favicon.ico', 'robots.txt'];
foreach ($publicFiles as $file) {
    echo "   - public/$file: ";
    if (file_exists(__DIR__ . "/public/$file")) {
        echo "✓ EXISTS\n";
    } else {
        echo "✗ MISSING\n";
    }
}

// Test 4: Check Laravel core directories
echo "4. Checking Laravel core directories:\n";
$coreDirs = ['app', 'bootstrap', 'config', 'database', 'resources', 'routes', 'storage', 'vendor'];
foreach ($coreDirs as $dir) {
    echo "   - $dir/: ";
    if (is_dir(__DIR__ . "/$dir")) {
        echo "✓ EXISTS\n";
    } else {
        echo "✗ MISSING\n";
    }
}

// Test 5: Check if vendor/autoload.php is accessible
echo "5. Checking Composer autoloader: ";
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    echo "✓ EXISTS\n";
} else {
    echo "✗ MISSING\n";
}

// Test 6: Check if bootstrap/app.php is accessible
echo "6. Checking Laravel bootstrap: ";
if (file_exists(__DIR__ . '/bootstrap/app.php')) {
    echo "✓ EXISTS\n";
} else {
    echo "✗ MISSING\n";
}

// Test 7: Test basic Laravel bootstrap (without handling request)
echo "7. Testing Laravel bootstrap: ";
try {
    require_once __DIR__ . '/vendor/autoload.php';
    $app = require_once __DIR__ . '/bootstrap/app.php';
    if ($app instanceof \Illuminate\Foundation\Application) {
        echo "✓ SUCCESS\n";
    } else {
        echo "✗ FAILED - Invalid application instance\n";
    }
} catch (Exception $e) {
    echo "✗ FAILED - " . $e->getMessage() . "\n";
}

echo "\n=== Test Complete ===\n";
echo "If all tests show ✓, the root-level setup should work correctly.\n";
echo "You can now access your Laravel application from the root URL instead of /public/\n";
