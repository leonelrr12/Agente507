import 'dotenv/config'; // 👈 IMPORTANTE

export const config = {
  port: process.env.PORT || 3000,
  url_db: process.env.DATABASE_URL,
};

