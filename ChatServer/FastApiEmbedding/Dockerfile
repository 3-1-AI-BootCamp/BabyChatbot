FROM python:3.12

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY FastEmbeddingServer.py .

CMD ["uvicorn", "FastEmbeddingServer:app", "--host", "0.0.0.0", "--port", "8000"]