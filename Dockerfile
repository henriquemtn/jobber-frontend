# Usa a imagem base do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e instala as dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código para o diretório de trabalho
COPY . .

# Expondo a porta que o frontend vai rodar
EXPOSE 3000

# Comando para iniciar o frontend
CMD ["npm", "run", "dev"]