FROM node:20

WORKDIR /app

# Install hanya dependensi bot (express, cors, noblox.js, dotenv)
COPY server/package.json ./
RUN npm install --production

# Salin kode bot
COPY server/ ./

EXPOSE 7860

# Port default Hugging Face Spaces
ENV PORT=7860

CMD ["node", "index.js"]