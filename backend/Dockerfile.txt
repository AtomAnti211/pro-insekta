# backend/Dockerfile
FROM python:3.12-slim

# Playwright függőségek
RUN apt-get update && apt-get install -y \
    wget gnupg curl unzip libnss3 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 \
    libgbm1 libasound2 libxshmfence1 libx11-xcb1 libxext6 libxfixes3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Playwright telepítés
RUN pip install playwright && playwright install chromium

COPY backend/ .

EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
