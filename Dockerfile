FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias primero (mejor caching)
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/

RUN npm install -D @nestjs/cli
RUN npm install -D @types/node
RUN npm install -D prisma@latest
RUN npm install -D @prisma/client
RUN npm install -D @types/express
RUN npm install @prisma/adapter-pg
RUN npm install @nestjs/config
RUN npm install @nestjs/jwt jsonwebtoken
RUN npm install csv-parser
RUN npm install fast-csv
RUN npm install wait-on
RUN npm install @nestjs/terminus

RUN npm install

# Copiar el código fuente
COPY . .

# Copiar prisma config y schema
COPY ./apps/api/prisma.config.ts ./

# Generar Prisma Client (esto sí se puede hacer en build)
RUN npx prisma generate --schema=./apps/api/prisma/schema.prisma

# Build de la aplicación
RUN npm run build

# ========================
# Etapa final (más ligera)
# ========================
FROM node:20-alpine

WORKDIR /app

# Copiar solo lo necesario desde la etapa builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/package*.json ./

# Copiar el entrypoint script
#COPY ./apps/api/docker-entrypoint.sh .
#RUN chmod +x docker-entrypoint.sh

COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh


EXPOSE 3000

# Usar entrypoint
#ENTRYPOINT ["./apps/api/docker-entrypoint.sh"]
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD []   # ← Este CMD ahora funciona con el entrypoint

