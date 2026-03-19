import { defineConfig } from 'prisma/config';
import 'dotenv/config'; // 👈 IMPORTANTE

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL no está definido');
}

export default defineConfig({
  schema: 'apps/api/prisma/schema.prisma',
  migrations: {
    path: 'apps/api/prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL!, // 👈 🔥
  },
});