FROM node:20-alpine

WORKDIR /app

# Instala OpenSSL 3.0 e cria links para compatibilidade
RUN apk add --no-cache openssl3 && \
  ln -s /usr/lib/libssl.so.3 /usr/lib/libssl.so.1.1 || true && \
  ln -s /usr/lib/libcrypto.so.3 /usr/lib/libcrypto.so.1.1 || true

# Copia arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Usa .env de produção
COPY .env.docker .env

# Gera o client e compila
RUN npx prisma generate
RUN npm run build

# Inicia
CMD ["sh", "-c", "npx prisma migrate reset --force && npm run start:prod"]
