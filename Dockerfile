# Build image
FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm prune --production

# Production image
FROM node:24-alpine
WORKDIR /app

COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

USER root

ENV PORT=3000
ENV NODE_ENV=production
# ENV ORIGIN=http://localhost:${PORT}

EXPOSE $PORT

CMD ["node", "build"]
