FROM python:3.10-slim

# Ses kütüphaneleri (librosa, whisper) için gerekli sistem paketleri
RUN apt-get update && apt-get install -y ffmpeg libsm6 libxext6 libsndfile1

WORKDIR /app
COPY . /app

# Gereksinimleri yükle
RUN pip install --no-cache-dir -r requirements.txt

# Hugging Face varsayılan portu 7860
EXPOSE 7860
ENV PORT=7860

# Uygulamayı başlat
CMD ["python", "+kod/app.py"]
