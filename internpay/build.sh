#!/usr/bin/env bash
set -euo pipefail

# Build React frontend
cd internpay/frontend
npm install
npm run build

# Build Django backend
cd ../internpay_backend

# Install Python dependencies using uv
uv pip install --system -r requirements.txt

# Collect Django static files
python manage.py collectstatic --noinput

# Apply database migrations
python manage.py migrate
