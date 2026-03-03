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

const { spawn } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const appDir = path.resolve(__dirname, '..')

const nodeEnv = process.env.NODE_ENV || 'development'
const envFile = nodeEnv === 'production' ? '.env.production' : '.env.development'
const envFilePath = path.join(appDir, envFile)
const localEnvFilePath = path.join(appDir, '.env.local')

if (!fs.existsSync(envFilePath)) {
  console.warn(`Warning: ${envFile} not found. Using default environment variables.`)
}

// dotenv-cli loads files in order: first file, then second file (overrides)
const envFiles = [envFilePath]
if (fs.existsSync(localEnvFilePath)) {
  envFiles.push(localEnvFilePath)
}

const [, , ...commandArgs] = process.argv

if (commandArgs.length === 0) {
  console.error('Error: No command provided')
  console.error('Usage: node scripts/load-env.js <command> [args...]')
  process.exit(1)
}

// Resolve dotenv-cli: local node_modules, then hoisted root, then npx fallback
const rootDir = path.resolve(appDir, '../..')
const binPaths = [
  path.join(appDir, 'node_modules', '.bin', 'dotenv-cli'),
  path.join(rootDir, 'node_modules', '.bin', 'dotenv-cli'),
]
const dotenvCli = binPaths.find((bin) => fs.existsSync(bin)) || 'npx'

const dotenvArgs = [
  ...(dotenvCli === 'npx' ? ['dotenv-cli'] : []),
  ...envFiles.flatMap((file) => ['-e', file]),
  '--',
  ...commandArgs,
]

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
