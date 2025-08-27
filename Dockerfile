# build 
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# runtime
FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/build ./build
COPY --from=build /app/drizzle ./drizzle

EXPOSE 3000
CMD ["node", "build"]
