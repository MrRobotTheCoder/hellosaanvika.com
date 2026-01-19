#---------------Build Stage---------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

#---------------Runtime Stage---------------
FROM node:20-alpine
WORKDIR /app

# Create non-root user
RUN addgroup -S app && adduser -S app -G app

ENV NODE_ENV=production
ENV DATA_DIR=/app/data

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Ensure writable directories
RUN mkdir -p /app/data && chown -R app:app /app

USER app

EXPOSE 3000
CMD [ "npm", "start" ]