FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p /app/data /app/public/qr /app/public/qrcodes

# Set temporary DATABASE_URL for build process
ENV DATABASE_URL="file:/tmp/build.db"

# Initialize temporary database schema for build
RUN npm run db:push || echo "Build database initialization completed"

# Build the application
RUN npm run build

# Remove devDependencies after build to reduce image size
RUN npm prune --production

# Clean up temporary build database
RUN rm -f /tmp/build.db

# Set proper permissions for data directory
RUN mkdir -p /app/data && chmod -R 755 /app/data /app/public/qr /app/public/qrcodes

# Set runtime DATABASE_URL (will be overridden by docker-compose env)
ENV DATABASE_URL="file:/app/data/db.sqlite"

# Create startup script for database initialization
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Initializing database schema..."' >> /app/start.sh && \
    echo 'npm run db:push || echo "Database initialization failed"' >> /app/start.sh && \
    echo 'echo "Starting Next.js application..."' >> /app/start.sh && \
    echo 'exec npm start' >> /app/start.sh && \
    chmod +x /app/start.sh

EXPOSE 3000

# Use non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app
USER nextjs

CMD ["/app/start.sh"]
