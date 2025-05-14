FROM node:22-alpine as builder

workdir /build

COPY package.json .
COPY pnpm-lock.yaml .

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install

COPY . .

RUN pnpm build

FROM node:22-alpine as runner

WORKDIR /app

COPY --from=builder /build/dist ./dist
COPY --from=builder /build/package.json ./package.json
COPY --from=builder /build/pnpm-lock.yaml ./pnpm-lock.yaml

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --prod

CMD ["node", "dist/index.js"]