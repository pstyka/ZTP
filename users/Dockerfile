FROM python:3.13-slim

WORKDIR /app

COPY pyproject.toml uv.lock ./
COPY ./users ./users

RUN pip install -e .

ENV PYTHONPATH="${PYTHONPATH}:/app"

EXPOSE 8000

CMD ["uvicorn", "users.main:app", "--host", "0.0.0.0", "--port", "8080", "--log-level", "info"]