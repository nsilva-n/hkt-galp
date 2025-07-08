FROM python:3.11

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=app:create_app
ENV FLASK_ENV=development
ENV FLASK_RUN_PORT=5000
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_DEBUG=1

EXPOSE 5000

CMD ["flask", "run"]
