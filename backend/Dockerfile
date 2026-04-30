FROM node:22-bookworm-slim AS base
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Étape 1 : installation des dépendances
FROM base AS deps
WORKDIR /app
COPY package.json ./
RUN npm install

# Étape 2 : build TypeScript
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Étape 3 : image de production légère
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

EXPOSE 3001

# Les migrations sont appliquées au démarrage du conteneur (pas au build)
CMD npx prisma migrate deploy && node dist/src/main.js
