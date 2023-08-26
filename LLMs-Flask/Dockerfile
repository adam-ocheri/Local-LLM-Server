FROM python:3.11.4

WORKDIR /app

COPY .env /app/
COPY app/requirements.txt /app/
COPY app/app.py /app/

RUN pip install huggingface-hub python-dotenv

RUN . /app/.env && huggingface-cli login --token "$HUGGINGFACE_TOKEN"

RUN pip install --no-cache-dir -r requirements.txt && pip3 install torch --index-url https://download.pytorch.org/whl/cu117

EXPOSE 5000

CMD ["python", "app.py"]
