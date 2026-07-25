#!/usr/bin/env bash
set -euo pipefail

if [ ! -f frontend/dist/index.html ]; then
  echo "frontend/dist is missing. Run 'cd frontend && npm install && npm run build' locally before deploying."
  exit 1
fi

cd internpay_backend
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python manage.py collectstatic --noinput
