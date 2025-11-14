#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */
const { existsSync, copyFileSync, writeFileSync, mkdirSync } = require("fs");
const { join } = require("path");
const { execSync } = require("child_process");

console.log("🏠 Basement Inventory Setup\n");

const cwd = process.cwd();

// Environment file setup
const envPath = join(cwd, ".env");
const envExamplePath = join(cwd, ".env.example");

const createEnvFile = () => {
  if (existsSync(envPath)) {
    console.log("✅ .env file already exists");
    return;
  }

  if (existsSync(envExamplePath)) {
    console.log("📋 Creating .env file from template...");
    copyFileSync(envExamplePath, envPath);
    console.log("✅ .env file created");
  } else {
    console.log("⚠️  .env.example not found, creating basic .env...");
    const basicEnv = `DATABASE_URL=file:./data/db.sqlite
NEXT_PUBLIC_BASE_URL=http://localhost:3000
BASE_URL=http://localhost:3000
PORT=3000
`;
    writeFileSync(envPath, basicEnv);
    console.log("✅ Basic .env file created");
  }
};

// Directory creation helper
const createDirectory = (dirPath, name) => {
  if (!existsSync(dirPath)) {
    console.log(`📁 Creating ${name}...`);
    mkdirSync(dirPath, { recursive: true });
    console.log(`✅ ${name} created`);
  } else {
    console.log(`✅ ${name} already exists`);
  }
};

// Setup process
createEnvFile();

// Create required directories
createDirectory(join(cwd, "data"), "data directory");
createDirectory(join(cwd, "public", "qr"), "QR codes directory");

// Database initialization
const initializeDatabase = () => {
  console.log("🗃️  Initializing database...");
  try {
    execSync("npm run db:push", { stdio: "inherit" });
    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize database:", error.message);
    console.log(
      "Note: This may be normal if dependencies aren't installed yet."
    );
    console.log("Run 'npm run db:push' manually after 'npm install'");
  }
};

// Run setup
initializeDatabase();

const displayCompletionMessage = () => {
  console.log("\n🎉 Setup complete!");
  console.log("\nNext steps:");
  console.log('1. Run "npm run dev" to start the development server');
  console.log("2. Open http://localhost:3000 in your browser");
  console.log("3. Start adding your totes and items!");
  console.log('\nFor Docker: run "docker-compose up" instead');
};

displayCompletionMessage();
