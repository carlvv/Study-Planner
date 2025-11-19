FROM python:3.11-slim-bullseye
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apt update && \
    apt install -y \
    firefox-esr \
    wget \
    xvfb \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxi6 \
    libxtst6 \
    libnss3 \
    libcups2 \
    libxss1 \
    libxrandr2 \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libgbm1 \
    libdbus-glib-1-2 && \
    rm -rf /var/lib/apt/lists/*

RUN wget -O /tmp/geckodriver.tar.gz "https://github.com/mozilla/geckodriver/releases/download/v0.36.0/geckodriver-v0.36.0-linux64.tar.gz" && \
    tar -xzf /tmp/geckodriver.tar.gz -C /usr/local/bin/ && \
    chmod +x /usr/local/bin/geckodriver && \
    rm /tmp/geckodriver.tar.gz

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DISPLAY=:0

WORKDIR /app
COPY . .

RUN pip install --upgrade pip && \
    pip install pymongo && \
    pip install flake8 && \
    pip install selenium && \
    pip install debugpy
