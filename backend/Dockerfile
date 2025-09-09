# --------------------------
# Stage 1: builder
FROM python:3.10 AS builder

# Install build dependencies (needed to compile psycopg2 etc.)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN pip install --upgrade pip 

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


# --------------------------
# Stage 2: production
FROM python:3.10-slim

# Install runtime dependencies: libpq + supervisor
RUN apt-get update && apt-get install -y \
    libpq5 \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Create user and workdir
RUN useradd -m -r appuser && \
    mkdir /app && \
    chown -R appuser /app

WORKDIR /app

# Copy installed packages from builder stage
COPY --from=builder /usr/local/lib/python3.10/site-packages/ /usr/local/lib/python3.10/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/

# Copy project code
COPY --chown=appuser:appuser . .

# Copy supervisor config
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

USER appuser
EXPOSE 8000

# Start supervisor (manages Gunicorn + Celery worker)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
