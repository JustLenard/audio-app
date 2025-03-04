import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.POSTGRES_URL) {
	throw new Error('POSTGRES_URL environment variable is not set')
}

// export const client = postgres(process.env.POSTGRES_URL, { ssl: 'verify-full' })
export const client = postgres(process.env.POSTGRES_URL) // for local
export const db = drizzle(client, { schema })
