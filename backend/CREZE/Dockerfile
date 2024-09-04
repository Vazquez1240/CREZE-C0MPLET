FROM python:3.12.3-slim-bookworm

EXPOSE 8000

COPY requirements.txt /

RUN pip install --no-cache-dir -r /requirements.txt

COPY . /app

COPY .env /app/.env



WORKDIR /app

CMD ["dotenv", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]