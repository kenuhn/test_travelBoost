# DOWNLOAD AND INSTALL NODE_MODULES
FROM node:alpine as dependencies

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# BUILD THE APP
FROM node:alpine as builder

RUN npm install -g pnpm

WORKDIR /app

COPY . .

COPY --from=dependencies /app/node_modules ./node_modules

RUN pnpm run build

# RUN THE SERVER
FROM node:alpine as runner

RUN npm install -g pnpm

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# If you are using a custom next.config.js file, uncomment this line.
COPY --from=builder /app/next.config.js .
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["pnpm", "run:prod"]