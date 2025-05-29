FROM node:18

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file necessari
COPY package.json package-lock.json ./
RUN npm install

# Copia tutto il resto 
# COPY . .

# Copia il resto dei file dell'app
COPY app .

# Espone la porta 3000
EXPOSE 3000

# Comando per avviare l'applicazione in modalità sviluppo
CMD ["npm", "run", "dev"]