import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const nuxtBin = resolve(rootDir, 'node_modules/nuxt/bin/nuxt.mjs')

const child = spawn(process.execPath, [
  '--disable-warning=DEP0155',
  nuxtBin,
  'build',
], {
  cwd: rootDir,
  env: process.env,
  stdio: ['ignore', 'pipe', 'pipe'],
})

const ansiPattern = /\x1B\[[0-?]*[ -/]*[@-~]/g

function shouldSuppress(line) {
  const plain = line.replace(ansiPattern, '')
  return plain.includes('[plugin @tailwindcss/vite:generate:build] Sourcemap is likely to be incorrect')
}

function pipeFiltered(stream, output) {
  let buffered = ''

  stream.on('data', (chunk) => {
    buffered += chunk.toString()
    const lines = buffered.split(/\r?\n/)
    buffered = lines.pop() || ''

    for (const line of lines) {
      if (!shouldSuppress(line)) output.write(`${line}\n`)
    }
  })

  stream.on('end', () => {
    if (buffered && !shouldSuppress(buffered)) output.write(buffered)
  })
}

pipeFiltered(child.stdout, process.stdout)
pipeFiltered(child.stderr, process.stderr)

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exitCode = code || 0
})

child.on('error', (error) => {
  console.error(error)
  process.exitCode = 1
})
