#!/bin/sh
set -e

PYTHON_BIN="${PYTHON:-python}"
if ! command -v "$PYTHON_BIN" >/dev/null 2>&1; then
  PYTHON_BIN="python3"
fi

"$PYTHON_BIN" manage.py migrate --noinput
"$PYTHON_BIN" manage.py seed_education

exec "$PYTHON_BIN" -m gunicorn config.wsgi:application --bind "0.0.0.0:${PORT:-8000}"
