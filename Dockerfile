#---------------Build Stage---------------
FROM node:20-slim AS builder
WORKDIR /app

# Create non-root user (Debian way)
RUN groupadd -r app && useradd -r -g app app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

#---------------Runtime Stage---------------
FROM node:20-slim
WORKDIR /app

ENV NODE_ENV=production
ENV DATA_DIR=/app/data

# Copy user info from builder
COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group

# App runtime artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/data ./data
COPY --from=builder /app/content ./content
COPY --from=builder /app/lib ./lib

# Ensure writable directories
RUN chown -R app:app /app

USER app

EXPOSE 3000
CMD [ "npm", "start" ]