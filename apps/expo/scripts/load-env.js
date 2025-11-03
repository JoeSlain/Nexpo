#!/usr/bin/env node

/**
 * Environment file loader for Expo
 *
 * This script loads environment-specific .env files based on NODE_ENV:
 * - development: loads .env.development, then .env.local (if exists)
 * - production: loads .env.production, then .env.local (if exists)
 *
 * Usage: node scripts/load-env.js <command>
 * Example: node scripts/load-env.js expo start
 */

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

// Get the directory where this script is located
const scriptDir = __dirname
const appDir = path.resolve(scriptDir, '..')

// Determine environment from NODE_ENV or default to development
const nodeEnv = process.env.NODE_ENV || 'development'
const isProduction = nodeEnv === 'production'

// Determine which env file to load
const envFile = isProduction ? '.env.production' : '.env.development'
const envFilePath = path.join(appDir, envFile)
const localEnvFilePath = path.join(appDir, '.env.local')

// Check if env file exists
if (!fs.existsSync(envFilePath)) {
  console.warn(`Warning: ${envFile} not found. Using default environment variables.`)
}

// Load environment files using dotenv-cli
// dotenv-cli loads files in order: first file, then second file (overrides)
const envFiles = [envFilePath]

// Always load .env.local if it exists (highest priority)
if (fs.existsSync(localEnvFilePath)) {
  envFiles.push(localEnvFilePath)
}

// Get command and args from process.argv
const [, , ...commandArgs] = process.argv

if (commandArgs.length === 0) {
  console.error('Error: No command provided')
  console.error('Usage: node scripts/load-env.js <command> [args...]')
  process.exit(1)
}

// Find dotenv-cli binary in node_modules
// Check local node_modules first, then root (yarn workspaces may hoist)
const rootDir = path.resolve(appDir, '../..')
const localDotenvCli = path.join(appDir, 'node_modules', '.bin', 'dotenv-cli')
const rootDotenvCli = path.join(rootDir, 'node_modules', '.bin', 'dotenv-cli')
const dotenvCli = fs.existsSync(localDotenvCli)
  ? localDotenvCli
  : fs.existsSync(rootDotenvCli)
    ? rootDotenvCli
    : 'npx'

// Build dotenv-cli command
// dotenv-cli -e file1 -e file2 -- command args
const dotenvArgs = []
// If using npx, add dotenv-cli as first arg
if (dotenvCli === 'npx') {
  dotenvArgs.push('dotenv-cli')
}
envFiles.forEach((file) => {
  dotenvArgs.push('-e', file)
})
dotenvArgs.push('--', ...commandArgs)

// Spawn dotenv-cli with the command
const dotenv = spawn(dotenvCli, dotenvArgs, {
  stdio: 'inherit',
  shell: true,
  cwd: appDir,
})

dotenv.on('error', (error) => {
  console.error(`Error: Failed to start dotenv-cli: ${error.message}`)
  console.error('Make sure dotenv-cli is installed: yarn add -D dotenv-cli')
  process.exit(1)
})

dotenv.on('exit', (code) => {
  process.exit(code || 0)
})
