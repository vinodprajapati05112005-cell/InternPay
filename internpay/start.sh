#!/usr/bin/env bash
set -euo pipefail

cd internpay/internpay_backend
python manage.py migrate --noinput
exec gunicorn internpay.wsgi:application
