#!/bin/bash
set -e

alembic upgrade head

uvicorn users.main:app --host 0.0.0.0 --port 8080 --log-level info
