FROM node:20

# Buat direktori kerja
WORKDIR /app

# Salin package.json
COPY package.json ./

# Install dependensi
RUN npm install

# Salin index.js (Hugging Face upload manual biasanya ditaruh di root)
COPY index.js ./

# Expose port 7860 (Port default Hugging Face Spaces)
EXPOSE 7860

# Gunakan port 7860 untuk aplikasi
ENV ROBLOX_SERVER_PORT=7860

# Jalankan server
CMD ["node", "index.js"]
