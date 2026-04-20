FROM node:22-alpine

WORKDIR /app

ARG DATABASE_URL=postgresql://postureflow_user:postureflow_password@postgres:5432/postureflow_db?schema=public
ENV DATABASE_URL=${DATABASE_URL}

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run prisma:generate && npm run build

EXPOSE 3000

CMD ["npm", "run", "start:docker"]
