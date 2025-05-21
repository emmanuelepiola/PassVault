# Usa l'immagine ufficiale di PostgreSQL
FROM postgres:latest

# Imposta le variabili d'ambiente per il database
ENV POSTGRES_USER=francesco
ENV POSTGRES_PASSWORD=fra
ENV POSTGRES_DB=PV

# Copia il file di inizializzazione nel percorso predefinito di PostgreSQL
COPY init.sql /docker-entrypoint-initdb.d/