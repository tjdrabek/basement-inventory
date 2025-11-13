# Basement Inventory App

A simple household inventory system for tracking storage totes and the items inside them.

## 🚀 Features

- Local SQLite by default using libsql
- Optional Turso hosted database
- QR codes for totes
- Search for items by name or brand
- Items belong to totes
- Works locally or in Docker

## 🛠️ Setup

### 1. Install dependencies

npm install

### 2. Create your `.env`

Copy this example:

DATABASE_URL=file:./data/db.sqlite

# OR use Turso:

# DATABASE_URL=https://your-db.turso.io

# DATABASE_AUTH_TOKEN=your-token

### 3. Run database migrations

npx drizzle-kit push

### 4. Start the app

npm run dev

## 🐳 Running with Docker

docker-compose up --build

## 🗄️ Database Options

### Local SQLite (default)

DATABASE_URL=file:./data/db.sqlite

### Hosted Turso

DATABASE_URL=https://your-db.turso.io
DATABASE_AUTH_TOKEN=your-token
