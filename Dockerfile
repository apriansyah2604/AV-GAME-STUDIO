FROM node:20

# Buat direktori kerja
WORKDIR /app

# Salin package.json utama dari root project
COPY package.json ./

# Install dependensi (termasuk express, noblox.js, cors)
RUN npm install

# Salin seluruh isi folder server ke direktori kerja
COPY server/ ./

# Expose port 7860 (Port default Hugging Face Spaces)
EXPOSE 7860

# Gunakan port 7860 untuk aplikasi
ENV ROBLOX_SERVER_PORT=7860

# Jalankan server
CMD ["node", "index.js"]
