# InternPay Backend

Production-oriented Django backend for the InternPay hackathon project.

## Stack

- Python 3.12+ compatible
- Django 6
- Django REST Framework
- SQLite for local development
- JWT authentication via SimpleJWT
- Swagger via drf-yasg
- CORS via django-cors-headers
- Gemini-powered AI evaluation with a deterministic local fallback
- WhiteNoise for production static files

## Project Layout

- `internpay/` project settings, URLs, WSGI/ASGI, and shared utilities
- `apps/` domain apps for users, companies, students, judges, contracts, milestones, submissions, AI, disputes, and notifications
- `media/uploads/` file storage for submissions and evidence
- `build.sh` Render build script
- `start.sh` Render start script
- `render.yaml` Render Blueprint
- `docs/` deployment notes and future docs

## Quick Start

1. Build the React app whenever frontend source changes so Django can serve the latest `frontend/dist` build:

```bash
cd ../frontend
npm install
npm run build
```

The generated `frontend/dist` folder is part of the deployable source for this project, so keep it in sync with frontend changes before you deploy.

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

## Render Deployment

Deploy everything as one Python web application plus one Render Postgres database.

1. Make sure the frontend build output exists in `frontend/dist` before you deploy. If you change the frontend source, rerun `npm run build` in `frontend/`.
2. Create a Render web service from this repository and use these commands:

```bash
Build Command: bash build.sh
Start Command: bash start.sh
```

3. Add a Render Postgres database and set `DATABASE_URL` from it.
4. Set these environment variables on the web service:

- `SECRET_KEY` - required, generate a strong random value
- `GEMINI_API_KEY` - required, your Gemini API key
- `GEMINI_MODEL` - recommended, use `gemini-2.5-flash`
- `PYTHON_VERSION` - recommended, pin a version such as `3.13.5`

5. Optional environment variables:

- `SITE_URL` - override the backend public URL if you are not using the Render-generated one
- `FRONTEND_URL` - override the frontend URL if you host it separately
- `CORS_ALLOWED_ORIGINS` - only needed when the frontend is on a different origin
- `CSRF_TRUSTED_ORIGINS` - only needed when the frontend is on a different origin or custom domain
- `DEFAULT_FROM_EMAIL`, `EMAIL_BACKEND`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `EMAIL_USE_TLS` - only needed if you want SMTP email delivery
- `MEDIA_ROOT` - set this if you attach a persistent disk for uploads on a paid Render plan

Render automatically provides `RENDER_EXTERNAL_URL` and `RENDER_EXTERNAL_HOSTNAME`, so you do not need to set them yourself.

If you need submission uploads or evidence files to persist across deploys, attach a persistent disk on a paid Render plan and point `MEDIA_ROOT` at that mount path. The free tier uses an ephemeral filesystem.

## Notes

- SQLite is used by default for easy deployment and hackathon portability.
- Gemini is optional in the sense that the backend falls back to a deterministic heuristic report when the Gemini API is unavailable.
- The blockchain handoff points are left as clear TODO comments inside the relevant services.
- Frontend routes are handled by Django, so `/`, `/login`, `/dashboard`, and similar paths all return the React `index.html` shell when `frontend/dist` is present.
