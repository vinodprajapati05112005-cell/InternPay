#!/usr/bin/env bash
set -euo pipefail

cd internpay_backend
python manage.py migrate --noinput
exec gunicorn internpay.wsgi:application
