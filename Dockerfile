ARG NODE_VERSION=22.5.1
ARG PNPM_VERSION=10.8.0

FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@${PNPM_VERSION}

COPY package.json pnpm-lock.yaml* ./
COPY . .

RUN pnpm install
RUN pnpm prisma generate
RUN pnpm run build
# RUN find / -name "*libquery_engine*" || echo "No query engine found"
RUN pnpm prune --prod

FROM node:${NODE_VERSION}-alpine
WORKDIR /app

# Install pnpm in the final image as well
RUN npm install -g pnpm@${PNPM_VERSION}

COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
# Copy Prisma schema and generated client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated/prisma/client ./src/generated/prisma/client
# COPY --from=builder /app/node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node ./build/server/chunks/
COPY package.json .

EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]