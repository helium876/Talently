import { sql } from 'kysely'
import { randomUUID } from 'crypto'

export const dbFunctions = {
  uuid: () => sql`(${randomUUID()})`,
  now: () => sql`DATETIME('now')`,
  timestamp: (date: Date) => sql`DATETIME(${date.toISOString()})`,
} 