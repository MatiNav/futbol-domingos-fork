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
ARG REDIS_HOST
ARG REDIS_PORT
ARG REDIS_PASSWORD
ARG REDIS_USERNAME
ARG PUSHER_APP_ID
ARG PUSHER_KEY
ARG PUSHER_SECRET
ARG PUSHER_CLUSTER
ARG NEXT_PUBLIC_PUSHER_KEY
ARG NEXT_PUBLIC_PUSHER_CLUSTER

ENV MONGODB_URI=${MONGODB_URI} \
    GCP_PROJECT_ID=${GCP_PROJECT_ID} \
    GCP_CLIENT_EMAIL=${GCP_CLIENT_EMAIL} \
    GCP_PRIVATE_KEY=${GCP_PRIVATE_KEY} \
    REDIS_HOST=${REDIS_HOST} \
    REDIS_PORT=${REDIS_PORT} \
    REDIS_PASSWORD=${REDIS_PASSWORD} \
    REDIS_USERNAME=${REDIS_USERNAME} \
    PUSHER_APP_ID=${PUSHER_APP_ID} \
    PUSHER_KEY=${PUSHER_KEY} \
    PUSHER_SECRET=${PUSHER_SECRET} \
    PUSHER_CLUSTER=${PUSHER_CLUSTER} \
    NEXT_PUBLIC_PUSHER_KEY=${NEXT_PUBLIC_PUSHER_KEY} \
    NEXT_PUBLIC_PUSHER_CLUSTER=${NEXT_PUBLIC_PUSHER_CLUSTER}

RUN echo "MONGODB_URI: ${MONGODB_URI}"

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run build

FROM base AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs

RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/next.config.mjs ./

## TODO: Remove this
COPY --from=builder /app/next.config.js ./  

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]

