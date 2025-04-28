# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
COPY tsconfig.json* ./
COPY next.config.js* ./
COPY public ./public
COPY src ./src

# Install dependencies
RUN npm install

# Build Next.js app
RUN npm run build

# Expose frontend port
EXPOSE 3000

# Start in production mode
CMD ["npm", "start"]