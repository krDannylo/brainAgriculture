FROM node:20-alpine

WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia os arquivos do projeto
COPY . .

# Copia a env de produção e usa ela no build
COPY .env.docker .env

# GERA O CLIENT DENTRO DO CONTAINER com os binários corretos!
RUN npx prisma generate

# Compila o projeto
RUN npm run build

# Executa migrações e inicia a aplicação
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
