FROM node:22-alpine AS builder

WORKDIR /build

COPY package.json .
COPY pnpm-lock.yaml .

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV HUSKY=0
RUN pnpm install

COPY . .

RUN pnpm build

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /build/dist ./dist
COPY --from=builder /build/package.json ./package.json
COPY --from=builder /build/pnpm-lock.yaml ./pnpm-lock.yaml

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV HUSKY=0
RUN pnpm install --prod

CMD ["node", "dist/index.js"]