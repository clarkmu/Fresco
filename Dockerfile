FROM --platform=linux/amd64 node:lts-alpine AS base

# Install dependencies only when needed
FROM base AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
#RUN apk add --no-cache libc6-compat
WORKDIR /app

# Prisma stuff
COPY prisma ./prisma

# Copy package.json and lockfile, along with postinstall script
COPY package.json pnpm-lock.yaml* postinstall.js migrate-and-start.sh setup-database.js initialize.js ./

# work around signature verification issue: https://github.com/nodejs/corepack/issues/612
RUN npm install -g corepack@latest

# Install pnpm and install dependencies
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install git - this is needed to get the app version during build
RUN apk add --no-cache git

ENV SKIP_ENV_VALIDATION=true

# work around signature verification issue: https://github.com/nodejs/corepack/issues/612
RUN npm install -g corepack@latest

RUN corepack enable pnpm && pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

# Ensure the container runs with an arbitrary user ID
RUN chown -R 1001:0 /app
RUN chmod -R g+rw /app

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown -R 1001:0 .next
RUN chmod -R g+rw .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=1001:0 /app/.next/standalone ./
COPY --from=builder --chown=1001:0 /app/.next/static ./.next/static
COPY --from=builder --chown=1001:0 /app/initialize.js ./
COPY --from=builder --chown=1001:0 /app/setup-database.js ./
COPY --from=builder --chown=1001:0 /app/migrate-and-start.sh ./
COPY --from=builder --chown=1001:0 /app/prisma ./prisma

RUN apk add --no-cache libc6-compat curl openssl

RUN mkdir /.npm
RUN chown -R 1001:0 /.npm
RUN chmod -R g+rw /.npm

USER 1001

EXPOSE 3000

ENV PORT 3000

# we can skip indidvidual db values
ENV SKIP_ENV_VALIDATION 1


# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["sh", "migrate-and-start.sh"]
