ARG NODE_VERSION=22.5.1
ARG PNPM_VERSION=10.8.1

# Builder image
FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@${PNPM_VERSION}

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

COPY prisma ./prisma/
RUN pnpx prisma generate --generator build

COPY . .
RUN pnpm run build

# Final image
FROM node:${NODE_VERSION}-alpine
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

# Install pnpm in the final image as well
RUN npm install -g pnpm@${PNPM_VERSION}
RUN pnpm install -P --frozen-lockfile

# Copy Prisma schema and generated client
# COPY this first since it's not related to the other stage
COPY prisma ./prisma/
# this gets finished first in the other stage
COPY --from=builder /app/generated/prisma-client ./generated/prisma-client/
# This way we layer it as well as possible
COPY --from=builder /app/build ./build/

EXPOSE 3000
# ENV NODE_ENV=production
CMD [ "node", "build/index.js" ]