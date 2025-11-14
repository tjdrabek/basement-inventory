# 🪟 Windows Setup Guide

Quick setup instructions specifically for Windows users.

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- Git ([Download](https://git-scm.com/download/win))
- (Optional) Docker Desktop ([Download](https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe))

## 🚀 Quick Start

### Option 1: Automatic Setup (Recommended)

```cmd
git clone https://github.com/tjdrabek/basement-inventory.git
cd basement-inventory
npm install
npm run setup
npm run dev
```

### Option 2: Manual Setup

```cmd
git clone https://github.com/tjdrabek/basement-inventory.git
cd basement-inventory
npm install
copy .env.example .env
npm run db:push
npm run dev
```

### Option 3: Docker (No Node.js needed)

```cmd
git clone https://github.com/tjdrabek/basement-inventory.git
cd basement-inventory
docker-compose up -d
```

## 🔧 Windows-Specific Commands

| Task          | Command Prompt                  | PowerShell                              |
| ------------- | ------------------------------- | --------------------------------------- |
| Copy file     | `copy .env.example .env`        | `Copy-Item .env.example .env`           |
| Delete folder | `rmdir /s folder_name`          | `Remove-Item -Recurse folder_name`      |
| Check port    | `netstat -ano \| findstr :3000` | `netstat -ano \| Select-String ":3000"` |

## ⚠️ Common Windows Issues

### PowerShell Execution Policy

```powershell
# If you get "execution policy" errors
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Path Issues

```cmd
# Use forward slashes or escape backslashes in paths
DATABASE_URL=file:./data/db.sqlite
# NOT: DATABASE_URL=file:.\data\db.sqlite
```

### Port Already in Use

```cmd
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID 1234 /F
```

### Docker Issues

```cmd
# Make sure Docker Desktop is running
# Check Docker status
docker version

# If containers won't start
docker system prune -f
docker-compose up --build
```

## 📁 File Locations

- **Database**: `data\db.sqlite`
- **QR Codes**: `public\qr\`
- **Environment**: `.env`
- **Docker Data**: Docker volumes (use Docker Desktop to view)

## 🆘 Troubleshooting

### "npm not found"

1. Install Node.js from [nodejs.org](https://nodejs.org)
2. Restart Command Prompt/PowerShell
3. Run `node --version` to verify

### "git not found"

1. Install Git from [git-scm.com](https://git-scm.com/download/win)
2. Restart Command Prompt/PowerShell
3. Run `git --version` to verify

### Database errors

```cmd
# Reset database
del data\db.sqlite
npm run db:push
```

### Permission errors

```cmd
# Run as Administrator (right-click Command Prompt/PowerShell)
# Or try with Node directly
node scripts/setup.js
```

### Clean reinstall

```cmd
rmdir /s /q node_modules
rmdir /s /q .next
rmdir /s /q data
npm install
npm run setup
```

## 🎯 Next Steps

1. Open http://localhost:3000 in your browser
2. Create your first tote
3. Add some items
4. Generate QR labels for your totes

## 📞 Still Need Help?

1. Check [SETUP.md](SETUP.md) for general troubleshooting
2. Try [DOCKER.md](DOCKER.md) for Docker-specific issues
3. Open an issue on GitHub with your error message
4. Include your Windows version and Node.js version
