#!/usr/bin/env bash
set -euo pipefail

# Build React frontend
cd frontend
npm install
npm run build

# Build Django backend
cd ../internpay_backend

python -m pip install --upgrade pip
python -m pip install -r requirements.txt

python manage.py collectstatic --noinput
python manage.py migrate
