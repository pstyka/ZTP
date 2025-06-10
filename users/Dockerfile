FROM python:3.13-slim

WORKDIR /app

COPY pyproject.toml uv.lock ./
COPY ./users ./users

RUN pip install -e .

ENV PYTHONPATH="${PYTHONPATH}:/app"

COPY alembic.ini ./
COPY ./alembic ./alembic

EXPOSE 8888

CMD ["sh", "-c", "python -c 'from users.models import Base; from users.database import engine; Base.metadata.create_all(engine)' && uvicorn users.main:app --host 0.0.0.0 --port 8888 --log-level debug"]
