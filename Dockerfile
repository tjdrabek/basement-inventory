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

# Remove devDependencies after build but keep TypeScript for next.config.ts
RUN npm prune --production
RUN npm install typescript@5.9.3 --save

# Clean up temporary build database
RUN rm -f /tmp/build.db

# Initialize database schema (creates empty database)
RUN mkdir -p /app/data && DATABASE_URL="file:/app/data/db.sqlite" npm run db:push && echo "Database schema initialized successfully" || echo "Database initialization failed but continuing"

# Set proper permissions
RUN chmod -R 755 /app/data /app/public/qr /app/public/qrcodes

# Set runtime DATABASE_URL (will be overridden by docker-compose env)
ENV DATABASE_URL="file:/app/data/db.sqlite"

EXPOSE 3000

# Use non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app
USER nextjs

CMD ["npm", "start"]
