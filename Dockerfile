FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install -D @nestjs/cli
RUN npm install -D @types/node
RUN npm install -D prisma@latest
RUN npm install -D @prisma/client
RUN npm install @nestjs/config
RUN npm install @nestjs/jwt jsonwebtoken
RUN npm install csv-parser
RUN npm install fast-csv

RUN npm install

COPY . .

RUN npx prisma generate --schema=./apps/api/prisma/schema.prisma

#RUN npx prisma format --schema=./apps/api/prisma/schema.prisma
#RUN npx prisma validate --schema=./apps/api/prisma/schema.prisma

#RUN npx prisma migrate dev --schema=./apps/api/prisma/schema.prisma

#RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]