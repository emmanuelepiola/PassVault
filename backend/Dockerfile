FROM node:18

# Imposta la directory di lavoro
WORKDIR /app

# Copia solo package.json
COPY package.json ./
RUN npm install

COPY . .

# Espone la porta 8000
EXPOSE 8000

# Comando per avviare il server
CMD ["node", "server.js"]