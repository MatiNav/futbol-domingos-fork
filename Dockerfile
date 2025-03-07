FROM node:18-alpine AS base

ENV NEXT_TELEMETRY_DISABLED 1

FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./

RUN pnpm install

FROM base AS builder

ARG MONGODB_URI

ARG GCP_PROJECT_ID

ARG GCP_CLIENT_EMAIL

ARG GCP_PRIVATE_KEY

ENV MONGODB_URI=${MONGODB_URI}

ENV GCP_PROJECT_ID=${GCP_PROJECT_ID}

ENV GCP_CLIENT_EMAIL=${GCP_CLIENT_EMAIL}

ENV GCP_PRIVATE_KEY=${GCP_PRIVATE_KEY}

WORKDIR /app

RUN npm install -g pnpm

ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN pnpm run build

FROM base AS runner

WORKDIR /app

ENV NODE_ENV production

RUN npm install -g pnpm

RUN addgroup --system --gid 1001 nodejs

RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next ./next

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["pnpm", "start"]

