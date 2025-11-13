FROM node:20

WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm ci

COPY . .

# Create directory for SQLite inside container
RUN mkdir -p /app/data

# Build Next.js
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
