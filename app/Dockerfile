FROM node:18

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file necessari per npm install
COPY app/package.json app/package-lock.json ./
RUN npm install

# Copia tutto il codice dell'app
COPY app .

# Build the Next.js application for production
RUN npm run build

# Espone la porta 3000
EXPOSE 3000

# Comando per avviare l'applicazione in modalità produzione
CMD ["npm", "start"]