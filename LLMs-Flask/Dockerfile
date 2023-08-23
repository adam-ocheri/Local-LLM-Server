FROM python:3.8

WORKDIR /app

COPY app/requirements.txt /app/
COPY app/app.py /app/
# Add more necessary files here

# Set the environment variable for the token
ENV HF_TOKEN = ${HUGGINGFACE_TOKEN}

RUN pip install --no-cache-dir -r requirements.txt && pip3 install torch --index-url https://download.pytorch.org/whl/cu117 && huggingface-cli login --token $HF_TOKEN

EXPOSE 5000

CMD ["python", "app.py"]
