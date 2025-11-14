#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🏠 Basement Inventory Setup\n");

// Check if .env exists
const envPath = path.join(process.cwd(), ".env");
const envExamplePath = path.join(process.cwd(), ".env.example");

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log("📋 Creating .env file from template...");
    fs.copyFileSync(envExamplePath, envPath);
    console.log("✅ .env file created");
  } else {
    console.log("⚠️  .env.example not found, creating basic .env...");
    const basicEnv = `DATABASE_URL=file:./data/db.sqlite
NEXT_PUBLIC_BASE_URL=http://localhost:3000
BASE_URL=http://localhost:3000
PORT=3000
`;
    fs.writeFileSync(envPath, basicEnv);
    console.log("✅ Basic .env file created");
  }
} else {
  console.log("✅ .env file already exists");
}

// Create data directory if it doesn't exist
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  console.log("📁 Creating data directory...");
  fs.mkdirSync(dataDir, { recursive: true });
  console.log("✅ Data directory created");
} else {
  console.log("✅ Data directory already exists");
}

// Create QR codes directory if it doesn't exist
const qrDir = path.join(process.cwd(), "public", "qr");
if (!fs.existsSync(qrDir)) {
  console.log("📁 Creating QR codes directory...");
  fs.mkdirSync(qrDir, { recursive: true });
  console.log("✅ QR codes directory created");
} else {
  console.log("✅ QR codes directory already exists");
}

// Initialize database
console.log("🗃️  Initializing database...");
try {
  execSync("npm run db:push", { stdio: "inherit" });
  console.log("✅ Database initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize database:", error.message);
  console.log("Note: This may be normal if dependencies aren't installed yet.");
  console.log("Run 'npm run db:push' manually after 'npm install'");
}

console.log("\n🎉 Setup complete!");
console.log("\nNext steps:");
console.log('1. Run "npm run dev" to start the development server');
console.log("2. Open http://localhost:3000 in your browser");
console.log("3. Start adding your totes and items!");
console.log('\nFor Docker: run "docker-compose up" instead');
