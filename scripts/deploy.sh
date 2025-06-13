#!/bin/bash

# This script deploys backend, admin, and main site to Hostinger VPS
# Make sure to make this executable: chmod +x deploy.sh

echo "🔗 Connecting to Hostinger VPS..."

ssh -p $VPS_PORT $VPS_USERNAME@$VPS_HOST << 'EOF'
echo "✅ Logged into VPS: $VPS_USERNAME@$VPS_HOST"

echo "📁 Navigating to /var/www"
cd /var/www

# Clone the repo if it doesn't exist
if [ ! -d vivavista_cicd_uk ]; then
  echo "🌀 Cloning repository..."
  git clone https://github.com/StrixSid07/vivavista_cicd_uk.git
fi

echo "📦 Pulling latest changes..."
cd vivavista_cicd_uk
git fetch origin
git reset --hard origin/main

############### BACKEND SETUP ##################
echo "🚀 Setting up backend (vivavistaukbackend)..."
cd vivavistaukbackend
npm install

echo "🔁 Restarting backend with PM2..."
pm2 stop vivavista-backend-uk || true
pm2 start server.js --name vivavista-backend-uk
pm2 save
pm2 startup

############### ADMIN PANEL ##################
echo "🛠️ Building admin panel (vivavistaadminuk)..."
cd ../vivavistaukadmin
npm install
npm run build

echo "📤 Deploying admin panel to /var/www/vivavistaadminuk..."
rm -rf /var/www/vivavistaadminuk/*
cp -r dist/* /var/www/vivavistaadminuk/

############### MAIN WEBSITE ##################
echo "🌐 Building main website (vivavistauk)..."
cd ../vivavistauk
npm install
npm run build

echo "📤 Deploying main website to /var/www/vivavistauk..."
rm -rf /var/www/vivavistauk/*
cp -r dist/* /var/www/vivavistauk/

echo "✅ Deployment completed successfully!"
EOF
