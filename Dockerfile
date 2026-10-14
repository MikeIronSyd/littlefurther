FROM node:24.19.0-bookworm-slim@sha256:a9f5f7c91a432850b2a8a7797adf5eadb6c733ceed61167806cee7ea7fbc29df AS tooling
WORKDIR /app
RUN npm install --global pnpm@11.19.0

FROM tooling AS build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY src ./src
COPY tsconfig.json tsconfig.server.json vite.config.ts index.html ./
RUN pnpm run build

FROM tooling AS production-dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

FROM node:24.19.0-bookworm-slim@sha256:a9f5f7c91a432850b2a8a7797adf5eadb6c733ceed61167806cee7ea7fbc29df AS runtime
WORKDIR /app
ENV NODE_ENV=production CAPSTONE_DATA_DIR=/app/.local/data
COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
RUN mkdir -p /app/.local/data && chown -R node:node /app/.local
USER node
CMD ["node", "dist/server/index.js"]
