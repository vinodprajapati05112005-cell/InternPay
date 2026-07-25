from datetime import timedelta
from pathlib import Path
from urllib.parse import urlparse
import os

from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

try:
    import dj_database_url
except ImportError:  # pragma: no cover - optional during local dev
    dj_database_url = None

try:
    from whitenoise.middleware import WhiteNoiseMiddleware  # noqa: F401
except ImportError:  # pragma: no cover - optional during local dev
    WHITENOISE_AVAILABLE = False
else:
    WHITENOISE_AVAILABLE = True


BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")
FRONTEND_DIR = BASE_DIR.parent / "frontend"
FRONTEND_DIST_DIR = FRONTEND_DIR / "dist"
FRONTEND_TEMPLATE_DIRS = [str(FRONTEND_DIST_DIR)] if FRONTEND_DIST_DIR.exists() else []
FRONTEND_STATIC_DIRS = [str(FRONTEND_DIST_DIR)] if FRONTEND_DIST_DIR.exists() else []


def env(key: str, default=None):
    value = os.getenv(key)
    if value is None or value == "":
        return default
    return value


def env_bool(key: str, default=False):
    value = env(key)
    if value is None:
        return default
    return str(value).strip().lower() in {"1", "true", "yes", "on"}


def env_list(key: str, default=""):
    raw = env(key, default)
    if not raw:
        return []
    return [item.strip() for item in str(raw).split(",") if item.strip()]


def normalize_host(value: str | None) -> str | None:
    if not value:
        return None
    parsed = urlparse(value)
    if parsed.hostname:
        return parsed.hostname
    if "://" in value:
        return None
    return value.strip() or None


def normalize_origin(value: str | None) -> str | None:
    if not value:
        return None
    parsed = urlparse(value)
    if parsed.scheme and parsed.netloc:
        return f"{parsed.scheme}://{parsed.netloc}"
    return None


def unique(values):
    seen = set()
    result = []
    for value in values:
        if not value or value in seen:
            continue
        seen.add(value)
        result.append(value)
    return result


IS_RENDER = env_bool("RENDER")
DEBUG = env_bool("DEBUG", default=not IS_RENDER)

SECRET_KEY = env("SECRET_KEY")
if not SECRET_KEY:
    if IS_RENDER:
        raise ImproperlyConfigured("SECRET_KEY must be set on Render.")
    SECRET_KEY = "django-insecure-internpay-development-key"

RENDER_EXTERNAL_URL = env("RENDER_EXTERNAL_URL", "")
RENDER_EXTERNAL_HOSTNAME = env("RENDER_EXTERNAL_HOSTNAME", "")

SITE_URL = env("SITE_URL", RENDER_EXTERNAL_URL or "http://127.0.0.1:8000")
FRONTEND_URL = env("FRONTEND_URL", SITE_URL if IS_RENDER else "http://localhost:5173")

ALLOWED_HOSTS = unique(
    env_list("ALLOWED_HOSTS", "127.0.0.1,localhost,testserver")
    + [normalize_host(SITE_URL), normalize_host(FRONTEND_URL), RENDER_EXTERNAL_HOSTNAME]
)

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "drf_yasg",
    "apps.common.apps.CommonConfig",
    "apps.users.apps.UsersConfig",
    "apps.companies.apps.CompaniesConfig",
    "apps.students.apps.StudentsConfig",
    "apps.judges.apps.JudgesConfig",
    "apps.contracts.apps.ContractsConfig",
    "apps.milestones.apps.MilestonesConfig",
    "apps.submissions.apps.SubmissionsConfig",
    "apps.ai_engine.apps.AiEngineConfig",
    "apps.disputes.apps.DisputesConfig",
    "apps.notifications.apps.NotificationsConfig",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "internpay.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": FRONTEND_TEMPLATE_DIRS,
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "internpay.wsgi.application"

database_url = env("DATABASE_URL", "")
if database_url:
    if dj_database_url is None:
        if IS_RENDER:
            raise ImproperlyConfigured("DATABASE_URL is set but dj-database-url is not installed.")
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.sqlite3",
                "NAME": BASE_DIR / "db.sqlite3",
            }
        }
    else:
        DATABASES = {
            "default": dj_database_url.config(
                default=database_url,
                conn_max_age=600,
                ssl_require=not DEBUG,
            )
        }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

AUTH_USER_MODEL = "users.User"
AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
]

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = env("TIME_ZONE", "Asia/Kolkata")
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = Path(env("STATIC_ROOT", BASE_DIR / "staticfiles"))
STATICFILES_DIRS = FRONTEND_STATIC_DIRS
MEDIA_URL = "/media/"
MEDIA_ROOT = Path(env("MEDIA_ROOT", BASE_DIR / "media"))

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

EMAIL_BACKEND = env("EMAIL_BACKEND", "django.core.mail.backends.console.EmailBackend")
EMAIL_HOST = env("EMAIL_HOST", "")
EMAIL_PORT = int(env("EMAIL_PORT", "587"))
EMAIL_HOST_USER = env("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD", "")
EMAIL_USE_TLS = env("EMAIL_USE_TLS", "True").lower() in {"1", "true", "yes", "on"}
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL", "noreply@internpay.local")

SESSION_COOKIE_SECURE = env_bool("SESSION_COOKIE_SECURE", default=not DEBUG)
CSRF_COOKIE_SECURE = env_bool("CSRF_COOKIE_SECURE", default=not DEBUG)

CORS_ALLOW_CREDENTIALS = True
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True
else:
    CORS_ALLOWED_ORIGINS = unique(
        env_list("CORS_ALLOWED_ORIGINS")
        + ([FRONTEND_URL] if FRONTEND_URL and FRONTEND_URL != SITE_URL else [])
    )

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_THROTTLE_CLASSES": (
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ),
    "DEFAULT_THROTTLE_RATES": {
        "anon": env("THROTTLE_ANON", "60/min"),
        "user": env("THROTTLE_USER", "120/min"),
    },
    "EXCEPTION_HANDLER": "internpay.utils.exceptions.exception_handler",
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=int(env("JWT_ACCESS_MINUTES", "15"))),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=int(env("JWT_REFRESH_DAYS", "7"))),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
    "UPDATE_LAST_LOGIN": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

PASSWORD_RESET_TIMEOUT = int(env("PASSWORD_RESET_TIMEOUT", "3600"))

FILE_UPLOAD_MAX_MEMORY_SIZE = int(env("FILE_UPLOAD_MAX_MEMORY_SIZE", str(25 * 1024 * 1024)))

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
CSRF_TRUSTED_ORIGINS = unique(
    env_list("CSRF_TRUSTED_ORIGINS")
    + [origin for origin in [normalize_origin(SITE_URL), normalize_origin(FRONTEND_URL), RENDER_EXTERNAL_URL] if origin]
)

if WHITENOISE_AVAILABLE:
    MIDDLEWARE.insert(1, "whitenoise.middleware.WhiteNoiseMiddleware")
    STORAGES = {
        "default": {
            "BACKEND": "django.core.files.storage.FileSystemStorage",
        },
        "staticfiles": {
            "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
        },
    }
