# Basement Inventory - Setup Instructions

Welcome to Basement Inventory! This guide will help you get the application running on your machine.

## Prerequisites

- Node.js 18 or later
- npm (comes with Node.js)
- Git

## Quick Setup

### 1. Clone and Install

```bash
git clone https://github.com/tjdrabek/basement-inventory.git
cd basement-inventory
npm install
```

### 2. Environment Setup

The application will automatically create a `.env` file from the template during installation. If you need to modify it:

```bash
# Option 1: Use the setup script (recommended)
npm run setup

# Option 2: Manual copy
# Windows Command Prompt
copy .env.example .env

# Windows PowerShell
Copy-Item .env.example .env

# macOS/Linux
cp .env.example .env
```

### 3. Start the Application

**For Development:**

```bash
npm run dev
```

**For Docker:**

```bash
docker-compose up
```

### 4. Access the Application

Open your browser to: http://localhost:3000

## Troubleshooting

### Database Issues

If you encounter database problems:

```bash
# Reinitialize the database
npm run db:push
```

### Permission Issues (macOS/Linux)

```bash
# Make scripts executable
chmod +x scripts/setup.js
```

### Windows-Specific Issues

```cmd
# If you get execution policy errors in PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Run setup directly with Node
node scripts/setup.js

# If 'copy' command fails, use PowerShell
Copy-Item .env.example .env
```

### Docker Issues

```bash
# Rebuild containers
docker-compose down
docker-compose up --build
```

### Clear Everything and Start Over

```bash
# Windows (Command Prompt)
rmdir /s data
rmdir /s .next
rmdir /s node_modules
npm install

# Windows (PowerShell)
Remove-Item -Recurse -Force data, .next, node_modules -ErrorAction SilentlyContinue
npm install

# macOS/Linux
rm -rf data/ .next/ node_modules/
npm install
```

## Platform-Specific Notes

### Windows

- Use Command Prompt or PowerShell
- Paths use backslashes (\)
- Docker Desktop required for Docker setup

### macOS/Linux

- Use Terminal
- Paths use forward slashes (/)
- Docker installed via package manager

### All Platforms

- The application creates a local SQLite database
- QR codes are generated and stored in `public/qr/`
- No external services required for basic functionality

## Need Help?

1. Check the main README.md for detailed documentation
2. Ensure all prerequisites are installed
3. Try the Docker option if local setup fails
4. Open an issue on GitHub if problems persist
