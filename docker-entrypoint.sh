#!/bin/sh
set -e

echo "========================================"
echo "🚀 Iniciando API - Agente507"
echo "========================================"

echo "🔄 Esperando PostgreSQL..."
npx wait-on tcp:db:5432 --timeout 60000 || echo "⚠️ Timeout esperando DB"

echo "🚀 Ejecutando migraciones Prisma..."
npx prisma migrate deploy --schema=./apps/api/prisma/schema.prisma

echo "🔧 Generando Prisma Client..."
npx prisma generate --schema=./apps/api/prisma/schema.prisma

echo "✅ Iniciando NestJS..."
exec node dist/apps/api/main.js