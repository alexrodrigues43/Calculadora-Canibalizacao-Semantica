# Estagio 1: Builder
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Estagio 2: Runner
FROM node:22-slim AS runner
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps --ignore-scripts && npm cache clean --force
COPY --from=builder /app/dist ./dist
EXPOSE 8080
CMD ["node", "dist/server.cjs"]
