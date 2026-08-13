#!/usr/bin/env bash
set -euo pipefail

cd internpay/internpay_backend
python manage.py migrate --noinput
exec gunicorn --bind "0.0.0.0:${PORT:-10000}" internpay.wsgi:application
