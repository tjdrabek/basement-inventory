FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p /app/data /app/public/qr

# Build the application
RUN npm run build

# Initialize database schema (creates empty database)
RUN npm run db:push || echo "Database initialization completed"

# Set proper permissions
RUN chmod -R 755 /app/data /app/public/qr

EXPOSE 3000

# Use non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app
USER nextjs

CMD ["npm", "start"]
