FROM python:3.13-slim

WORKDIR /app

COPY pyproject.toml uv.lock ./
COPY ./gateway ./gateway

RUN pip install -e .

ENV PYTHONPATH=/app

EXPOSE 8000

CMD ["uvicorn", "gateway.main:app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "info"]