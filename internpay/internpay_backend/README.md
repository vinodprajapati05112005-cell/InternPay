# InternPay Backend

Production-oriented Django backend for the InternPay hackathon project.

## Stack

- Python 3.12+ compatible
- Django 6
- Django REST Framework
- SQLite
- JWT authentication via SimpleJWT
- Swagger via drf-yasg
- CORS via django-cors-headers
- OpenAI-powered AI evaluation with a local fallback

## Project Layout

- `internpay/` project settings, URLs, WSGI/ASGI, and shared utilities
- `apps/` domain apps for users, companies, students, judges, contracts, milestones, submissions, AI, disputes, and notifications
- `media/uploads/` file storage for submissions and evidence
- `docs/` deployment notes and future docs

## Quick Start

1. Build the React app once so Django can serve it:

```bash
cd ../frontend
npm install
npm run build
```

2. Create and activate a virtual environment, then install backend dependencies:

```bash
cd ../internpay_backend
pip install -r requirements.txt
```

3. Create your local environment file:

```bash
copy .env.example .env
```

4. Run migrations and collect the Django-served frontend build:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --noinput
```

5. Create an admin user:

```bash
python manage.py createsuperuser
```

6. Start the server:

```bash
python manage.py runserver
```

The Django app now serves:

- React routes such as `/`, `/login`, `/dashboard`, and all other client-side routes
- backend APIs under `/api/`
- static files under `/static/`
- media files under `/media/`

## API Docs

- Swagger UI: `/swagger/`
- OpenAPI JSON: `/openapi.json`

## Authentication

- Register: `POST /api/auth/register/`
- Login: `POST /api/auth/login/`
- Refresh: `POST /api/auth/refresh/`
- Logout: `POST /api/auth/logout/`
- Profile: `GET/PATCH /api/auth/profile/`

## Core Workflows

- Company creates contracts and milestones.
- Student submits work with links and files.
- AI evaluates the submission and stores an `AIReport`.
- Company or student can file a dispute within the dispute window.
- Judge resolves disputes.
- Blockchain integration is intentionally left as TODO placeholders for the teammate who owns on-chain execution.

## PythonAnywhere Deployment

Deploy everything as one Python web application. Do not create a second Node or React service, and do not run `npm run dev` in production.

Django serves the React production build from `frontend/dist`, together with the API, static files, and media files.

1. Build the React frontend locally or in your deployment workspace:

```bash
cd TrustBite/internpay/frontend
npm install
npm run build
```

2. Copy or upload the generated `frontend/dist` folder together with the Django backend code.
3. On PythonAnywhere, create one Python web app and point its WSGI file at `internpay.wsgi.application`.
4. Create a virtualenv, install requirements, and set the environment variables from `.env.example`.
5. Run the Django setup commands once:

```bash
cd TrustBite/internpay/internpay_backend
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic
```

6. Reload the same web app after any frontend rebuild.

In the PythonAnywhere web app config:

- Set the working directory to the backend root.
- Point the WSGI file at `internpay.wsgi.application`.
- No separate frontend app is needed.
- Ensure `ALLOWED_HOSTS` includes your PythonAnywhere domain.

## Notes

- SQLite is used by default for easy deployment and hackathon portability.
- OpenAI is optional. If `OPENAI_API_KEY` is not set, the backend uses a deterministic fallback evaluator so the app still works end to end.
- The blockchain handoff points are left as clear TODO comments inside the relevant services.
- Frontend routes are handled by Django, so `/`, `/login`, `/dashboard`, and similar paths all return the React `index.html` shell.
