import * as fs from 'node:fs'
import * as path from 'node:path'

const join = (p) => path.resolve(p)

try {
  const DEVELOPMENT_PATH = '.env.development'
  const LOCAL_PATH = '.env.local'
  const PRODUCTION_PATH = '.env.production'
  const envDevelopment = fs.readFileSync(join(DEVELOPMENT_PATH), 'utf8')
  const existsLocal = fs.existsSync(join(LOCAL_PATH))
  const existsProduction = fs.existsSync(join(PRODUCTION_PATH))
  if (!existsLocal) {
    fs.writeFileSync(join(LOCAL_PATH), envDevelopment)
  }
  if (!existsProduction) {
    fs.writeFileSync(join(PRODUCTION_PATH), envDevelopment)
  }
} catch (error) {
  console.error(error)
}
