FROM node:22.12.0-alpine3.21 AS base
RUN mkdir /app
WORKDIR /app

FROM base AS build
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm install
COPY tsconfig.json .
COPY backend backend
COPY frontend frontend

FROM build AS frontend
ARG API_URL
RUN --mount=type=secret,id=env,required=true,target=/app/frontend/.env VITE_API_URL=${API_URL:-'${API_URL}'} npm run -w frontend build

FROM build AS backend
RUN npm run -w backend build

FROM base AS release
COPY backend/package.json package.json
COPY --from=build /app/node_modules /app/node_modules
COPY --from=backend /app/backend/target/build /app/backend
COPY --from=frontend /app/frontend/target/build /app/frontend
RUN npm install --omit dev

FROM base AS dependencies
COPY --from=release /app/node_modules /app/node_modules

FROM dependencies
COPY --from=release /app/backend /app/backend
COPY --from=release /app/frontend /app/frontend
ENV NODE_ENV=production
ENV ROOT=/app/frontend
USER node
ENTRYPOINT ["node", "--enable-source-maps", "backend/index.js"]