# Basement Inventory App

A simple household inventory system for tracking storage totes and the items inside them. Generate QR codes for totes and easily search for items across your storage.

## 🚀 Features

- **QR Code Integration**: Generate printable QR labels for totes
- **Item Management**: Add, edit, move, and delete items with detailed tracking
- **Search & Filter**: Find items by name, brand, description, or tote location
- **Tote Organization**: Group items in totes with visual organization
- **Multiple Deployment Options**: Local development, Docker, or cloud hosting
- **Database Flexibility**: SQLite for local use or Turso for cloud hosting
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Quick Start

### Option 1: Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/tjdrabek/basement-inventory.git
   cd basement-inventory
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment**

   ```bash
   npm run setup
   ```

   _This automatically creates .env from .env.example_

   **Or manually:**

   ```bash
   # Windows
   copy .env.example .env

   # macOS/Linux
   cp .env.example .env
   ```

4. **Initialize the database**

   ```bash
   npm run db:push
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser** to [http://localhost:3000](http://localhost:3000)

### Option 2: Docker (Recommended for Production)

1. **Clone the repository**

   ```bash
   git clone https://github.com/tjdrabek/basement-inventory.git
   cd basement-inventory
   ```

2. **Set up Docker environment** (optional - uses defaults if skipped)

   ```bash
   npm run docker:setup  # Creates .env.docker from template
   # Edit .env.docker if you need custom settings
   ```

3. **Start with Docker Compose**

   ```bash
   docker-compose up -d
   ```

4. **Open your browser** to [http://localhost:3000](http://localhost:3000)

## 🐳 Docker Management

### Quick Commands

```bash
# Start the application
docker-compose up -d

# View logs
npm run docker:logs

# Stop the application
npm run docker:down

# Rebuild and restart
npm run docker:dev

# Clean up everything (removes data!)
npm run docker:clean
```

### Docker Features

- **Persistent Data**: Database and QR codes stored in Docker volumes
- **Automatic Restart**: Container restarts automatically on system reboot
- **Health Checks**: Built-in health monitoring
- **Isolated Environment**: No conflicts with local Node.js versions
- **Production Ready**: Optimized build with security best practices

3. **Open your browser** to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
basement-inventory/
├── app/                    # Next.js app directory
│   ├── api/               # API routes for CRUD operations
│   ├── item/              # Item management pages
│   ├── items/             # Items listing page
│   ├── tote/              # Tote management pages
│   └── totes/             # Totes listing page
├── components/            # Reusable React components
├── drizzle/              # Database schema and migrations
├── lib/                  # Utility functions and database client
├── data/                 # Local SQLite database (auto-created)
└── public/               # Static assets and QR codes
```

## 🔧 Configuration

### Environment Variables

The application uses these environment variables (see `.env.example`):

- `DATABASE_URL`: Database connection string
  - Local SQLite: `file:./data/db.sqlite`
  - Turso: `libsql://your-database.turso.io`
- `DATABASE_AUTH_TOKEN`: Required only for Turso
- `NEXT_PUBLIC_BASE_URL`: Public URL for QR code generation
- `BASE_URL`: Internal base URL
- `PORT`: Server port (default: 3000)

### Database Options

**SQLite (Default)**: Perfect for local development and small deployments

- Zero configuration required
- Data stored in `./data/db.sqlite`
- Automatically created on first run

**Turso (Optional)**: For cloud hosting and scaling

- Create account at [turso.tech](https://turso.tech)
- Update `DATABASE_URL` and `DATABASE_AUTH_TOKEN` in `.env`

## 🚀 Deployment Options

### Vercel (Recommended)

1. Fork this repository
2. Connect to Vercel
3. Set environment variables for Turso database
4. Deploy

### Docker

```bash
docker build -t basement-inventory .
docker run -p 3000:3000 -v $(pwd)/data:/app/data basement-inventory
```

### Local Production

```bash
npm run build
npm start
```

## 📱 Usage

1. **Create Totes**: Add storage containers with names and descriptions
2. **Add Items**: Store items in totes with quantities, brands, and descriptions
3. **Generate QR Codes**: Print labels for physical totes
4. **Search Everything**: Find items across all totes quickly
5. **Move Items**: Reorganize items between totes easily

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

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
